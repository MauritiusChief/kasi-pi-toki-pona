"use client";

import { useCallback, useMemo, useState } from "react";
import type { StructureEntry } from "@/types/structure";

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function useStructureTreePlaceholder() {
  const [entries, setEntries] = useState<StructureEntry[]>([]);

  const toggleStructureRow = useCallback((id: string) => {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === id ? { ...entry, expanded: !entry.expanded } : entry
      )
    );
  }, []);

  const addStructureRow = useCallback(() => {
    setEntries((current) => [
      ...current,
      {
        id: createId("entry"),
        summary: "空句子",
        expanded: true,
        sending: false,
        elapsed: 0, // TODO: 需要适配LLM的思索（若有）
        tkContext: "",
        tkSubject: "",
        tkOther: "",
      },
    ]);
  }, []);

  const removeStructureRow = useCallback((id: string) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const sendStructureRow = useCallback((id: string) => {
    console.info("sendStructureRow placeholder invoked", { id });
  }, []);

  const canSendStructureRow = useCallback((entry: StructureEntry) => !entry.sending, []);

  const structureSummary = useCallback((entry: StructureEntry) => entry.summary, []);

  const loadingHint = useMemo(() => "点击条目右侧的箭头可单独发送，展开后可编辑详情。", []);

  const updateEntryField = useCallback(
    (id: string, field: keyof Pick<StructureEntry, "summary" | "tkContext" | "tkSubject" | "tkOther">, value: string) => {
      setEntries((current) =>
        current.map((entry) =>
          entry.id === id
            ? {
                ...entry,
                [field]: value,
              }
            : entry
        )
      );
    },
    []
  );

  return {
    entries,
    toggleStructureRow,
    addStructureRow,
    removeStructureRow,
    sendStructureRow,
    canSendStructureRow,
    structureSummary,
    loadingHint,
    updateEntryField,
  } as const;
}
