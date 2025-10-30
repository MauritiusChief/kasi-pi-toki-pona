export type StatusState = "idle" | "loading" | "success" | "error";

export type DictionaryStatus = {
  state: StatusState;
  totalEntries?: number;
  errorMessage?: string;
};

export type ApiStatus = {
  state: StatusState;
  message?: string;
};

export type ReasoningLog = {
  id: string;
  startAt: Date;
  endAt?: Date;
  content: string; // 实时拼接的最终回答
  reasoning: string; // 实时拼接的 reasoning
  expanded: boolean;
}