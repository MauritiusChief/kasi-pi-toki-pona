import { Dispatch, SetStateAction } from "react";
import { ApiStatus, DictionaryStatus } from "@/types/status";
import { DictionaryEntry } from "@/types/dictionary";
import { SentenceNodeEntry } from "@/types/structure";

/**
 * 跨组件共享的状态Context，包含状态、思索过程，以及对应的修改函数
 * TODO 由于思索过程需要对应的结构树ID，可能需要放置在DataContext内部
 */
export type StatusContext = {
  status: {
    dictionary: DictionaryStatus,
    api: ApiStatus,
  },
  setContextStatus: Dispatch<SetStateAction<{dictionary: DictionaryStatus, api: ApiStatus}>>
}
/**
 * 跨组件共享的数据Context，包含输入、输出和结构树，以及对应的修改函数
 */
export type DataContext = {
  input: String,
  structureTree: SentenceNodeEntry[]
}
/**
 * 跨组件共享的字典Context，以及对应的修改函数
 */
export type DictionaryContext = {
  dictionaryEntries: DictionaryEntry[],
  setContextDictionary: Dispatch<SetStateAction<DictionaryEntry[]>>
}