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

        // 裁切函数
        const trct = (text: string): string => {
          if (text.length <= 4) return text;
          return text.slice(0, 3) + '...';
        }
        // 同步更新标题
        const summaryFromFrame = (frame: { tkContext?: string; tkSubject?: string; tkOther?: string }): string => {
          if (typeof frame.tkContext === 'string' && typeof frame.tkSubject === 'string' && typeof frame.tkOther === 'string') {
            return `${trct(frame.tkContext)} | ${trct(frame.tkSubject)} | ${trct(frame.tkOther)}`
          }
          return "（略）"
        }

        if (frames.length > 0) {
          setContextStructureTree((current) => [
            ...current,
            ...frames.map((frame) => ({
              id: createId("sentence"),
              summary: summaryFromFrame(frame),
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

