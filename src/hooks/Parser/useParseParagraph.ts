"use client";

import { streamParse } from "@/lib/parseTemplate";
import type { DataContext, StatusContext } from "@/types/context";
import { Msg } from "@/types/parse";

const placeholderSystemPrompt = "请将用户输入的文本按以下“toki pona式句子”的定义进行含义提取和标记：每个“toki pona式句子”包含三种成分, 1. 背景，其功能是交待句子的背景信息，可以为空；2. 主语，表明句子陈述或说明的核心对象，主语可以包括多个对象，可以为空；3. 其他，所有其他成分均归入此列，在主语不为空的情况下可以为空。示例：如果下雨了，我和小明就需要回屋子里避雨。解析结果应当是 [背景]下雨了 [主语]我、小明 [其他]需要回屋子里避雨"

/**
 * 提交一个parse paragraph请求：创建会话 + 走 /api/parse_paragraph
 * TODO 分离出一个模板函数，只有id, system prompt, user prompt 等不同，往ReasoningLogs里面加log的逻辑等是通用的。
 * @returns
 */
export async function useParseParagraph(dataContext: DataContext, statusContext: StatusContext) {
  const { inputParagraph, setContextInputParagraph, api } = dataContext;
  const { setContextResoningLogs } = statusContext;

  setContextInputParagraph({...inputParagraph, sending: true})

  const messages: Msg[] = [
    { role: "system", content: placeholderSystemPrompt },
    { role: "user", content: inputParagraph.input },
  ];

  await streamParse({
    url: "/api/parse_paragraph",
    messages,
    bodyExtra: {
      apiKey: api.key,
      model: api.choice,
      reasoning: { enabled: true },
    },
    setSending: (sending) => setContextInputParagraph((prev) => ({ ...prev, sending })),
    setLogs: setContextResoningLogs,
    logId: "root",

    // 如果你的后端将“思考”片段放在别的字段，可自定义 extractDelta
    // extractDelta: (obj) => ({ contentChunk: ..., reasoningChunk: ... }),

    // onEventJSON: (obj) => {
    //   // 若需要顺带处理 tokens、usage、进度等，可在这里做副作用
    //   // 比如：statusContext.setTokens(obj.usage?.total_tokens ?? 0);
    // },
  });

}