"use client"

import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { ApiStatus, DictionaryStatus } from "@/types/status";

/**
 * 规范所有需要跨组件共享的数据信息和函数
 */
type AppContextType = {
  data: AppContextData,
  setContextData: Dispatch<SetStateAction<AppContextData>>
}
/**
 * 共享的数据
 */
type AppContextData = {
  status: {
    dictionary: DictionaryStatus,
    api: ApiStatus,
  },
}

const defaultAppContextData: AppContextData = {
  status: {
    dictionary: {state: "loading", totalEntries: 0, errorMessage: ""},
    api: {state: "loading", message: ""},
  }
}
const defaultAppContext: AppContextType = {
  data: defaultAppContextData,
  setContextData: ()=>{}
}

const AppContext = createContext<AppContextType>(defaultAppContext);

/**
 * 构建Context tag
 * @param param0
 * @returns
 */
export function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // 管理Context中的data
  const [contextData, setContextData] = useState<AppContextData>(defaultAppContextData);

  const value: AppContextType = {data: contextData, setContextData: setContextData}

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * 供其他组件获取Context的函数
 * @returns
 */
export const useAppContext = () => useContext(AppContext);