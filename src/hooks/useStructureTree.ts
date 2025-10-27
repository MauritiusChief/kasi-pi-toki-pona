"use client";

import { useState } from "react";
import { SentenceNodeEntry } from "@/types/structure";
import { useSentenceNodes } from "./StructureTree/useSentenceNode";

/**
 * 管理存储起来的结构树
 * @returns
 */
export function useStructureTree() {
  const [entries, setEntries] = useState<SentenceNodeEntry[]>([]);

  const {
    toggleSentenceNode,
    addSentenceNode,
    removeSentenceNode,
    sendSentenceNode,
    canSendSentenceNode,
    structureSummary,
    updateEntryField,
  } = useSentenceNodes(setEntries)

  return {
    entries,
    toggleSentenceNode,
    addSentenceNode,
    removeSentenceNode,
    sendSentenceNode,
    canSendSentenceNode,
    structureSummary,
    updateEntryField,
  }
}

export default useStructureTree;