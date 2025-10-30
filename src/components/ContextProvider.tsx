"use client"

import { createContext, useContext, useState } from "react";
import type { ApiStatus, DictionaryStatus } from "@/types/status";
import type { DictionaryEntry } from "@/types/dictionary";
import type { DataContext, DictionaryContext, StatusContext } from "@/types/context";
import type { ParagraphNode, SentenceNodeEntry } from "@/types/structure";
import { ReasoningLog } from "@/types/parse";

// 各种初始Context
const defaultStatus: {dictionary: DictionaryStatus, api: ApiStatus} = { // 仅用于规范初始StatusContext
  dictionary: {state: "loading", totalEntries: 0, errorMessage: ""},
  api: {state: "loading", message: ""},
}
const defaultStatusContext: StatusContext = {
  status: defaultStatus,
  setContextStatus: ()=>{},
  reasoningLogs: [],
  setContextResoningLogs: ()=>{},
}
const defaultDataContext: DataContext = {
  api: {
    choice: "", setApiChoice: ()=>{},
    key: "", setApiKey: ()=>{},
  },
  inputParagraph: {input: "", sending: false},
  setContextInputParagraph: ()=>{},
  structureTree: [],
  setContextStructureTree: ()=>{},
}
const defaultDictionaryContext: DictionaryContext = {
  dictionaryEntries: [],
  setContextDictionary: ()=>{}
}

const statusContext = createContext<StatusContext>(defaultStatusContext);
const dataContext = createContext<DataContext>(defaultDataContext);
const dictionaryContext = createContext<DictionaryContext>(defaultDictionaryContext);

/**
 * 构建StatusContext tag, 包含状态、思索过程，以及对应的修改函数
 * @param param0
 * @returns
 */
export function StatusProvider({children}: {children: React.ReactNode}) {
  const [status, setContextStatus] = useState<{dictionary: DictionaryStatus, api: ApiStatus}>(defaultStatus);
  const [reasoningLogs, setContextResoningLogs] = useState<ReasoningLog[]>([])

  return (
    <statusContext.Provider value={{status, setContextStatus, reasoningLogs, setContextResoningLogs}}>
      {children}
    </statusContext.Provider>
  );
}
/**
 * 供其他组件获取StatusContext的函数
 */
export const useStatusContext = () => useContext(statusContext);

/**
 * 构建DataContext tag, 包含输入、输出和结构树，以及对应的修改函数
 * @param param0
 * @returns
 */
export function DataProvider({children}: {children: React.ReactNode}) {
  const [inputParagraph, setContextInputParagraph] = useState<ParagraphNode>({input: "小孩在屋子里吃饭", sending: false});
  const [structureTree, setContextStructureTree] = useState<SentenceNodeEntry[]>([]);
  // const [choice, setApiChoice] = useState<string>("nvidia/nemotron-nano-12b-v2-vl:free");
  const [choice, setApiChoice] = useState<string>("nvidia/nemotron-nano-9b-v2:free");
  const [key, setApiKey] = useState<string>("");

  const api = {choice, setApiChoice, key, setApiKey}

  return (
    <dataContext.Provider value={{api, inputParagraph, setContextInputParagraph, structureTree, setContextStructureTree}}>
      {children}
    </dataContext.Provider>
  );
}
/**
 * 供其他组件获取DataContext的函数
 */
export const useDataContext = () => useContext(dataContext);

/**
 * 构建DictionaryContext tag
 * @param param0
 * @returns
 */
export function DictionaryProvider({children}: {children: React.ReactNode}) {
  const [dictionaryEntries, setContextDictionary] = useState<DictionaryEntry[]>([]);

  return (
    <dictionaryContext.Provider value={{dictionaryEntries, setContextDictionary}}>
      {children}
    </dictionaryContext.Provider>
  );
}
/**
 * 供其他组件获取DictionaryContext的函数
 */
export const useDictionaryContext = () => useContext(dictionaryContext);