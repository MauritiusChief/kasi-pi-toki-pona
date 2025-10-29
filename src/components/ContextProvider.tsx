"use client"

import { createContext, useContext, useState } from "react";
import type { ApiStatus, DictionaryStatus } from "@/types/status";
import type { DictionaryEntry } from "@/types/dictionary";
import type { DataContext, DictionaryContext, StatusContext } from "@/types/context";
import type { SentenceNodeEntry } from "@/types/structure";

// 各种初始Context
const defaultStatus: {dictionary: DictionaryStatus, api: ApiStatus} = { // 仅用于规范初始StatusContext
  dictionary: {state: "loading", totalEntries: 0, errorMessage: ""},
  api: {state: "loading", message: ""},
}
const defaultStatusContext: StatusContext = {
  status: defaultStatus,
  setContextStatus: ()=>{}
}
const defaultDataContext: DataContext = {
  input: "",
  structureTree: []
}
const defaultDictionaryContext: DictionaryContext = {
  dictionaryEntries: [],
  setContextDictionary: ()=>{}
}

const statusContext = createContext<StatusContext>(defaultStatusContext);
const dataContext = createContext<DataContext>(defaultDataContext);
const dictionaryContext = createContext<DictionaryContext>(defaultDictionaryContext);

/**
 * 构建StatusContext tag
 * @param param0
 * @returns
 */
export function StatusProvider({children}: {children: React.ReactNode}) {
  const [status, setContextStatus] = useState<{dictionary: DictionaryStatus, api: ApiStatus}>(defaultStatus);

  return (
    <statusContext.Provider value={{status, setContextStatus}}>
      {children}
    </statusContext.Provider>
  );
}
/**
 * 供其他组件获取StatusContext的函数
 */
export const useStatusContext = () => useContext(statusContext);

/**
 * 构建DataContext tag
 * @param param0
 * @returns
 */
export function DataProvider({children}: {children: React.ReactNode}) {
  const [input, setContextInput] = useState<String>("");
  const [structureTree, setContextStructureTree] = useState<SentenceNodeEntry[]>([]);

  return (
    <dataContext.Provider value={{input, structureTree}}>
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