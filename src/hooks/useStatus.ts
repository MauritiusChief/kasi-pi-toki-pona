"use client";

import { useMemo } from "react";
import type { ApiStatus, DictionaryStatus } from "@/types/status";
import { useDictionarySearch } from "./useDictionarySearch";

export function useDictionaryStatus(): DictionaryStatus {
  const { rows, isLoading } = useDictionarySearch();

  return useMemo(() => {
    if (isLoading) {
      return {
        state: "loading",
        totalEntries: 0,
      };
    }

    if (rows.length === 0) {
      return {
        state: "error",
        totalEntries: 0,
        errorMessage: "字典加载失败或为空",
      };
    }

    return {
      state: "success",
      totalEntries: rows.length,
    };
  }, [rows, isLoading]);
}

export function useApiStatusPlaceholder(): ApiStatus {
  return useMemo(
    () => ({
      state: "idle",
      message: "未连接",
    }),
    []
  );
}
