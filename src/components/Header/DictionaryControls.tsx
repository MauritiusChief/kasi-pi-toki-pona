"use client";

import { useCallback, useMemo } from "react";
import { loadDictionary } from "@/lib/dictionaryClient";
import { useDictionaryContext, useStatusContext } from "@/components/ContextProvider";
import { AVAILABLE_DICTIONARIES, getDictionaryConfigById } from "@/lib/dictionaries";

/**
 * 字典管理栏：切换字典或者重新连接字典
 * @returns
 */
export function DictionaryControls() {
  const statusContext = useStatusContext()
  const { currentDictionaryId, setCurrentDictionaryId, setContextDictionary } = useDictionaryContext();

  const nextDictionary = useMemo(() => {
    const currentIndex = AVAILABLE_DICTIONARIES.findIndex((dictionary) => dictionary.id === currentDictionaryId);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    const nextIndex = (safeIndex + 1) % AVAILABLE_DICTIONARIES.length;
    return AVAILABLE_DICTIONARIES[nextIndex];
  }, [currentDictionaryId]);

  const currentDictionaryName = useMemo(() => {
    try {
      return getDictionaryConfigById(currentDictionaryId).name;
    } catch {
      return "未知字典";
    }
  }, [currentDictionaryId]);

  const handleCycle = useCallback(() => {
    if (!nextDictionary) {
      return;
    }
    setCurrentDictionaryId(nextDictionary.id);
  }, [nextDictionary, setCurrentDictionaryId]);

  return (
    <div className="flex flex-wrap items-center gap-2" data-testid="dictionary-controls">
      <span className="text-sm font-semibold text-gray-700">字典管理</span>
      {/* 切换字典按钮 */}
      <button
        type="button"
        className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
        title={nextDictionary ? `切换到 ${nextDictionary.name}` : "暂无其他字典"}
        aria-label={nextDictionary
          ? `当前字典为 ${currentDictionaryName}，点击切换到 ${nextDictionary.name}`
          : `当前字典为 ${currentDictionaryName}`
        }
        onClick={handleCycle}
        disabled={!nextDictionary}
      >
        切换字典
      </button>
      {/* 刷新字典按钮 */}
      <button
        type="button"
        className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
        title="刷新字典状态"
        onClick={() => {
          loadDictionary(statusContext, setContextDictionary, currentDictionaryId);
        }}
      >
        刷新状态
      </button>
    </div>
  );
}

export default DictionaryControls;
