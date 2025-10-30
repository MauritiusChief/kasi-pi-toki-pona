"use client";

import type { Msg, DataContext, StatusContext } from "@/types/context";

const placeholderSystemPrompt = "请将用户输入的文本按以下“toki pona式句子”的定义进行含义提取和标记：每个“toki pona式句子”包含三种成分, 1. 背景，其功能是交待句子的背景信息，可以为空；2. 主语，表明句子陈述或说明的核心对象，主语可以包括多个对象，可以为空；3. 其他，所有其他成分均归入此列，在主语不为空的情况下可以为空。示例：如果下雨了，我和小明就需要回屋子里避雨。解析结果应当是 [背景]下雨了 [主语]我、小明 [其他]需要回屋子里避雨"

/**
 * 提交一个parse paragraph请求：创建会话 + 走 /api/parse_paragraph
 * TODO 分离出一个模板函数，只有id, system prompt, user prompt 等不同，往ReasoningLogs里面加log的逻辑等是通用的。
 * @returns
 */
export async function useParseParagraph(dataContext: DataContext, statusContext: StatusContext) {
  const inputParagraph = dataContext.inputParagraph
  const setContextInputParagraph = dataContext.setContextInputParagraph
  const setContextResoningLogs = statusContext.setContextResoningLogs

  setContextInputParagraph({...inputParagraph, sending: true})

  setContextResoningLogs(logs => { // 若无重复id则新建一条段落节点思索日志，有则更新之
    const newEntry = {
      id: "root",
      startAt: new Date(),
      content: "",
      reasoning: "",
      expanded: false,
    };
    if (!logs.some(l => l.id === "root")) return [newEntry, ...logs]; // 新建日志
    return logs.map(log => log.id === "root" ? newEntry : log) // 更新日志
  });
  const controller = new AbortController();

  try {
    // 与 /api/parse_paragraph 对接
    const resp = await fetch("/api/parse_paragraph", {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ // 需要在 /api/parse_paragraph 的请求体中解析
        apiKey: dataContext.api.key,
        model: dataContext.api.choice,
        messages: [
          { role: "system", content: placeholderSystemPrompt } satisfies Msg,
          { role: "user", content: inputParagraph.input } satisfies Msg
        ],
        reasoning: { enabled: true },
      }),
    });

    if (!resp.ok || !resp.body) {
      const text = await resp.text();
      throw new Error(text || `HTTP ${resp.status}`);
    }

    const reader = resp.body.getReader(); // 从 resp 中读取内容用
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    // 逐行解析 SSE：以 `data: {...}\n` 为一条
    while (true) {
      const { value, done } = await reader.read();
      if (done) break; // 结束解析Server Send Event
      buffer += decoder.decode(value, { stream: true }); // 把reader获取的内容暂时加到buffer，若无\n说明这一行数据还没传输完毕。

      let lineEnd: number;
      while ((lineEnd = buffer.indexOf("\n")) !== -1) { // 获取到了\n，说明传输完毕了这一/若干行了，可以把传输完毕的这一/若干行提取出来
        const line = buffer.slice(0, lineEnd).trim(); // 提取传输完毕的行
        buffer = buffer.slice(lineEnd + 1); // 未被提取的剩余部分保留在buffer中
        if (!line || line.startsWith(":")) continue;
        if (!line.startsWith("data:")) continue;

        const payload = line.slice(5).trim(); // 去掉 "data:" 这五个字符，剩下的就是 payload

        // 会话结束
        if (payload === "[DONE]") {
          setContextResoningLogs((logs) => logs.map( // 写入结束时间
            (log) => {
              if (log.id !== "root") return log
              console.log(log.content)
              console.log(log.reasoning)
              return {...log, endAt: new Date()}
            }
          ));
          setContextInputParagraph({...inputParagraph, sending: false})
          continue;
        }

        // 从 payload 中获取思索和答案，然后将思索和答案添加到 sessions 中去
        try {
          const obj = JSON.parse(payload);
          const delta = obj?.choices?.[0]?.delta ?? {};
          const contentChunk: string | undefined = delta.content;

          let reasoningChunk: string | undefined =
            typeof delta.reasoning === "string" ? delta.reasoning : undefined;

          setContextResoningLogs((logs) => logs.map(
            (log) => { // 实时写入新的reasoning和最终答案
              if (log.id !== "root") return log;
              return {
                ...log,
                content: contentChunk ? log.content + contentChunk : log.content,
                reasoning: reasoningChunk ? log.reasoning + reasoningChunk : log.reasoning,
              }
            }
          ));
        } catch {
          // 非 JSON（比如注释）忽略
        }
      }
    }
  } catch (err) {
    setContextResoningLogs((logs) => logs.map( // 写入出错和结束时间
      (log) => log.id === "root" ? {...log, endAt: new Date(), content: log.content + `\n\n[Error] ${(err as Error).message}`,} : log
    ));
    setContextInputParagraph({...inputParagraph, sending: false})
  }

}