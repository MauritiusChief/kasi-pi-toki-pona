"use client";

import { Dispatch, SetStateAction, useEffect, useRef } from "react";

import { createId } from "@/lib/createId";
import { ReasoningLog } from "@/types/parse";
import { SentenceNodeEntry } from "@/types/structure";

type UseSyncStructureTreeParams = {
  structureTree: SentenceNodeEntry[];
  setContextStructureTree: Dispatch<SetStateAction<SentenceNodeEntry[]>>;
  reasoningLogs: ReasoningLog[];
  setContextResoningLogs: Dispatch<SetStateAction<ReasoningLog[]>>;
};

export function useSyncStructureTree({
  structureTree,
  setContextStructureTree,
  reasoningLogs,
  setContextResoningLogs,
}: UseSyncStructureTreeParams) {
  const processedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (structureTree.length === 0) {
      processedRef.current.clear();
    }
  }, [structureTree]);

  useEffect(() => {
    const pending = reasoningLogs.filter(
      (log) => log.needsSyncToTree && !processedRef.current.has(log.id),
    );

    if (pending.length === 0) return;

    pending.forEach((log) => {
      processedRef.current.add(log.id);

      try {
        const parsed = JSON.parse(log.content);
        const frames: { tkContext?: string; tkSubject?: string; tkOther?: string }[] =
          Array.isArray(parsed?.result) ? parsed.result : [];

        if (frames.length > 0) {
          setContextStructureTree((current) => [
            ...current,
            ...frames.map((frame) => ({
              id: createId("sentence"),
              summary: "",
              expanded: true,
              sending: false,
              tkContext: frame.tkContext ?? "",
              tkSubject: frame.tkSubject ?? "",
              tkOther: frame.tkOther ?? "",
            } satisfies SentenceNodeEntry)),
          ]);
        }
      } catch (error) {
        console.error("解析 log.content 失败：", error, log.content);
      } finally {
        setContextResoningLogs((prev) =>
          prev.map((item) =>
            item.id === log.id ? { ...item, needsSyncToTree: false } : item,
          ),
        );
      }
    });
  }, [reasoningLogs, setContextResoningLogs, setContextStructureTree]);
}

