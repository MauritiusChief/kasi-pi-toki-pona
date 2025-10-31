import { ExtractDelta, ReasoningLog, StreamParseParams } from "@/types/parse";
import { SentenceNodeEntry } from "@/types/structure";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { createId } from "@/lib/createId";
import { useDataContext, useStatusContext } from "@/components/ContextProvider";

const defaultExtractDelta: ExtractDelta = (obj: any) => {
  const delta = obj?.choices?.[0]?.delta ?? {};
  const contentChunk: string | undefined = delta?.content;
  const reasoningChunk: string | undefined =
    typeof delta?.reasoning === "string" ? delta.reasoning : undefined;
  return { contentChunk, reasoningChunk };
};

/**
 * 若无重复id则新建一条段落节点思索日志，有则更新之
 * @param setLogs
 * @param logId
 */
function upsertStartLog(setLogs: Dispatch<SetStateAction<ReasoningLog[]>>, logId: string) {
  const newEntry: ReasoningLog = {
    id: logId,
    startAt: new Date(),
    content: "",
    reasoning: "",
    expanded: false,
  };
  setLogs((logs) =>
    logs.some((l) => l.id === logId)
      ? logs.map((l) => (l.id === logId ? newEntry : l))
      : [newEntry, ...logs]
  );
}

function writeEnd(
  setLogs: Dispatch<SetStateAction<ReasoningLog[]>>,
  logId: string,
) {
  console.log("writeEnd触发")
  // 只更新 endAt / 待同步标记，不碰 structureTree
  setLogs(prev =>
    prev.map(l => l.id === logId
      ? { ...l, endAt: new Date(), needsSyncToTree: true }
      : l
    )
  );
}

function LogsToTreeBridge(
  setStructureTree: Dispatch<SetStateAction<SentenceNodeEntry[]>>,
  reasoningLogs: ReasoningLog[],
  setReasoningLogs: Dispatch<SetStateAction<ReasoningLog[]>>,
) {
  console.log("LogsToTreeBridge 1触发")
  // const { setContextResoningLogs, reasoningLogs } = useStatusContext(); // ReasoningLog[]
  const processedRef = useRef(new Set<string>()); // 去重（dev 严格模式友好）
  console.log("LogsToTreeBridge 2触发")

  useEffect(() => {
    // 找到首个“需要同步且未处理”的 log
    const target = reasoningLogs.find(
      l => l.needsSyncToTree && l.endAt && l.content && !processedRef.current.has(l.id)
    );
    if (!target) return;

    try {
      const frames: { tkContext: string; tkSubject: string; tkOther: string }[] =
        JSON.parse(target.content).result ?? [];
      console.log(frames)

      setStructureTree((current) => [
        ...current,
        ...frames.map(frame => ({
          id: createId("sentence"),
          summary: "",
          expanded: true,
          sending: false,
          tkContext: frame.tkContext,
          tkSubject: frame.tkSubject,
          tkOther: frame.tkOther,
          // // 可选：记录来源，便于去重/追溯
          // sourceLogId: target.id,
        })),
      ]);

      processedRef.current.add(target.id);
      // 永久化“已同步”标记，避免热刷新后重复
      setReasoningLogs(prev => prev.map(l =>
        l.id === target.id ? { ...l, needsSyncToTree: false } : l
      ));
    } catch (e) {
      console.error("解析 log.content 失败：", e, target.content);
      // 解析失败也别无限重试
      processedRef.current.add(target.id);
      setReasoningLogs(prev => prev.map(l =>
        l.id === target.id ? { ...l, needsSyncToTree: false } : l
      ));
    }
  }, [reasoningLogs, setReasoningLogs, setStructureTree]);
}

function appendChunks(
  setLogs: Dispatch<SetStateAction<ReasoningLog[]>>,
  logId: string,
  contentChunk?: string,
  reasoningChunk?: string
) {
  if (!contentChunk && !reasoningChunk) return;
  setLogs((logs) =>
    logs.map((l) => {
      if (l.id !== logId) return l;
      return {
        ...l,
        content: contentChunk ? l.content + contentChunk : l.content,
        reasoning: reasoningChunk ? l.reasoning + reasoningChunk : l.reasoning,
      };
    })
  );
}

export async function streamParse({
  url,
  messages,
  bodyExtra,
  setSending,
  setLogs,
  logId,
  setStructureTree,
  reasoningLogs,
  extractDelta = defaultExtractDelta,
  onEventJSON,
}: StreamParseParams) {
  const controller = new AbortController();
  setSending(true);
  upsertStartLog(setLogs, logId);

  try {
    const resp = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        ...(bodyExtra ?? {}),
      }),
    });

    if (!resp.ok || !resp.body) {
      const text = await resp.text();
      throw new Error(text || `HTTP ${resp.status}`);
    }

    const reader = resp.body.getReader();
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
          console.log("payload为[DONE]")
          writeEnd(setLogs, logId);
          console.log("writeEnd之后")
          LogsToTreeBridge(setStructureTree, reasoningLogs, setLogs);
          console.log("LogsToTreeBridge之后")
          setSending(false);
          continue;
        }

        // 从 payload 中获取思索和答案，然后将思索和答案添加到 logs 中去
        try {
          const obj = JSON.parse(payload);
          onEventJSON?.(obj);
          const { contentChunk, reasoningChunk } = extractDelta(obj);
          appendChunks(setLogs, logId, contentChunk, reasoningChunk);
        } catch {
          // 非 JSON（比如注释）忽略
        }
      }
    }
  } catch (err) {
    // 写错误并结束
    setLogs((logs) =>
      logs.map((l) =>
        l.id === logId
          ? {
              ...l,
              endAt: new Date(),
              content: `${l.content}\n\n[Error] ${(err as Error)?.message}`,
            }
          : l
      )
    );
    setSending(false);
  }

  return {
    abort: () => controller.abort(),
  };
}