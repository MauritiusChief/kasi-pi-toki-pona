"use client";

import { useMemo, useState, useEffect } from "react";
import type { DictionaryEntry } from "@/types/dictionary";
import { getDictionaryEntries } from "@/lib/dictionaryClient";
import { AppContextData, useAppContext } from "@/components/ContextProvider";

/**
 * 根据搜索的文本，返回命中的字典条目行以及其他需要的函数
 * @returns
 */
export function useDictionarySearch() {
  const [searchText, setSearchText] = useState("");
  const [rows, setRows] = useState<DictionaryEntry[]>([]);
  const contextData = useAppContext().data;
  const setContextData = useAppContext().setContextData;

  useEffect(() => {
    const loadDictionary = async () => {
      // 加载中状态
      const newContextData: AppContextData = {...contextData,
        status: { ...contextData.status,
          dictionary: { ...contextData.status.dictionary, state: "loading" }
        }
      };
      setContextData(newContextData)
      try {
        const entries = await getDictionaryEntries();
        setRows(entries);
        // 成功加载状态
        const successContextData: AppContextData = {...contextData,
          status: { ...contextData.status,
            dictionary: { ...contextData.status.dictionary, state: "success", totalEntries: entries.length }
          }
        };
        setContextData(successContextData )
      } catch (error) {
        console.error("Failed to load dictionary:", error);
        setRows([]);
        // 加载失败状态
        const errorContextData: AppContextData = {...contextData,
          status: { ...contextData.status,
            dictionary: { ...contextData.status.dictionary, state: "error", errorMessage: String(error) }
          }
        };
        setContextData(errorContextData)
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
  } satisfies {
    searchText: string;
    setSearchText: (value: string) => void;
    rows: DictionaryEntry[];
    filteredRows: DictionaryEntry[];
  };
}
