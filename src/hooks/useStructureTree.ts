"use client";

import { useState } from "react";
import { SentenceNodeEntry } from "@/types/structure";

/**
 * 管理存储起来的结构树，维护单一的entries变量
 * @returns
 */
export function useStructureTree() {
  const [entries, setEntries] = useState<SentenceNodeEntry[]>([]);

  return {
    entries,
    setEntries,
  }
}

export default useStructureTree;