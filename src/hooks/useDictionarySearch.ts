"use client";

import { useMemo, useState, useEffect } from "react";
import type { DictionaryEntry } from "@/types/dictionary";
import { loadDictionary } from "@/lib/dictionaryClient";
import { useStatusContext, useDictionaryContext } from "@/components/ContextProvider";

/**
 * 根据搜索的文本，返回命中的字典条目行以及其他需要的函数
 * @returns
 */
export function useDictionarySearch() {
  const [searchText, setSearchText] = useState("");
  const dictionaryContext = useDictionaryContext();
  const statusContest = useStatusContext()

  useEffect(() => {
    loadDictionary(statusContest, dictionaryContext);
  }, []);

  const rows = dictionaryContext.dictionaryEntries;

  const filteredRows = useMemo(() => {
    if (!searchText) {
      return rows;
    }
    const normalized = searchText.trim().toLowerCase();
    return rows.filter((row) =>
      [row.source, row.translation, row.description].some((value) =>
        value.toLowerCase().includes(normalized)
      )
    );
  }, [searchText]);

  return {
    searchText,
    setSearchText,
    filteredRows,
  } satisfies {
    searchText: string;
    setSearchText: (value: string) => void;
    filteredRows: DictionaryEntry[];
  };
}
