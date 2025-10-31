import { Dispatch, SetStateAction } from "react";
import { SentenceNodeEntry } from "./structure";


export type Msg = { role: "user" | "system" | "assistant"; content: string };

export type ReasoningLog = {
  id: string;
  startAt: Date;
  endAt?: Date;
  content: string; // 实时拼接的最终回答
  reasoning: string; // 实时拼接的 reasoning
  expanded: boolean;
  needsSyncToTree?: boolean
}

export type ExtractDelta = (obj: any) => {
  contentChunk?: string;
  reasoningChunk?: string;
};

export type StreamParseParams = {
  /** 供 fetch 的 url，例如 "/api/parse" */
  url: string;
  /** request body 中要发送的 messages */
  messages: Msg[];
  /** 其他 body 字段（如 apiKey, model, reasoning 等） */
  bodyExtra?: Record<string, any>;
  /** 外层传入：设置信息的 setter */
  setSending: (sending: boolean) => void;
  setLogs: Dispatch<SetStateAction<ReasoningLog[]>>;
  setStructureTree: Dispatch<SetStateAction<SentenceNodeEntry[]>>;
  reasoningLogs: ReasoningLog[],
  /** 此次流式会写入/覆盖的日志 id（例如 "root" / "sentence-xxx"） */
  logId: string;

  /** 自定义如何从 payload JSON 中提取 content / reasoning 片段 */
  extractDelta?: ExtractDelta;

  /** 每个 JSON 事件（含非 content/reasoning 字段）需要额外处理时，可提供 */
  onEventJSON?: (obj: any) => void;
};