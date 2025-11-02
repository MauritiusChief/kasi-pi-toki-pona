import type { Dispatch, SetStateAction } from "react";
import type { DictionaryId } from "@/lib/dictionaries";
import type { DictionaryEntry } from "@/types/dictionary";
import type { ReasoningLog } from "@/types/parse";
import type { ApiStatus, DictionaryStatus } from "@/types/status";
import type { ParagraphNode, SentenceNodeEntry } from "@/types/structure";

/**
 * 跨组件共享的状态Context，包含状态、思索过程，以及对应的修改函数
 * 由于思索过程需要对应的结构树ID，可能需要放置在DataContext内部
 */
export type StatusContext = {
  status: {
    dictionary: DictionaryStatus;
    api: ApiStatus;
  };
  setContextStatus: Dispatch<
    SetStateAction<{ dictionary: DictionaryStatus; api: ApiStatus }>
  >;
  reasoningLogs: ReasoningLog[];
  setContextResoningLogs: Dispatch<SetStateAction<ReasoningLog[]>>;
};
/**
 * 跨组件共享的数据Context，包含输入、输出和结构树，以及对应的修改函数
 */
export type DataContext = {
  api: {
    choice: string;
    setApiChoice: Dispatch<SetStateAction<string>>;
    key: string;
    setApiKey: Dispatch<SetStateAction<string>>;
  };
  inputParagraph: ParagraphNode;
  setContextInputParagraph: Dispatch<SetStateAction<ParagraphNode>>;
  structureTree: SentenceNodeEntry[];
  setContextStructureTree: Dispatch<SetStateAction<SentenceNodeEntry[]>>;
};
/**
 * 跨组件共享的字典Context，以及对应的修改函数
 */
export type DictionaryContext = {
  dictionaryEntries: DictionaryEntry[];
  setContextDictionary: Dispatch<SetStateAction<DictionaryEntry[]>>;
  currentDictionaryId: DictionaryId;
  setCurrentDictionaryId: Dispatch<SetStateAction<DictionaryId>>;
};
