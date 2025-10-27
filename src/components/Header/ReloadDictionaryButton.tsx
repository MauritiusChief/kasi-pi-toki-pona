"use client";

import { useAppContext } from "@/components/ContextProvider";
import { loadDictionary } from "@/lib/dictionaryClient";


export function ReloadDictionaryButton() {
  const appContext = useAppContext();
  return (
    <button
      type="button"
      className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
      title="刷新字典状态"
      onClick={() => {
        loadDictionary(appContext);
      }}
    >
      刷新状态
    </button>
  );
}

export default ReloadDictionaryButton;