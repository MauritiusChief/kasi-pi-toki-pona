"use client";

import { useMemo, useState, useEffect } from "react";
import type { DictionaryEntry } from "@/types/dictionary";
import { getDictionaryEntries } from "@/lib/placeholders/dictionaryClient";

/**
 * 根据搜索的文本，返回命中的字典条目行以及其他需要的函数
 * @returns
 */
export function useDictionarySearch() {
  const [searchText, setSearchText] = useState("");
  const [rows, setRows] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const entries = await getDictionaryEntries();
        setRows(entries);
      } catch (error) {
        console.error("Failed to load dictionary:", error);
        setRows([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDictionary();
  }, []);

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
  }, [rows, searchText]);

  return {
    searchText,
    setSearchText,
    rows,
    filteredRows,
    isLoading,
  } satisfies {
    searchText: string;
    setSearchText: (value: string) => void;
    rows: DictionaryEntry[];
    filteredRows: DictionaryEntry[];
    isLoading: boolean;
  };
}
