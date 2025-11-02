"use client";

import { type Dispatch, type SetStateAction, useCallback } from "react";
import { createId } from "@/lib/createId";
import type { SentenceNodeEntry } from "@/types/structure";

/**
 * 使用setEntries创建管理函数，在句子一级管理结构树
 * @param setEntries 对应的setXxx函数
 * @returns
 */
export function useSentenceNodes(
  setEntries: Dispatch<SetStateAction<SentenceNodeEntry[]>>,
) {
  /**
   * 切换某一句子节点的展开/隐藏状态
   */
  const toggleSentenceNode = useCallback(
    (id: string) => {
      setEntries((current) =>
        current.map((entry) =>
          entry.id === id ? { ...entry, expanded: !entry.expanded } : entry,
        ),
      );
    },
    [setEntries],
  );

  /**
   * 添加句子节点
   */
  const addSentenceNode = useCallback(() => {
    setEntries((current) => [
      ...current,
      {
        id: createId("sentence"),
        summary: "（空）",
        expanded: true,
        sending: false,
        tkContext: "",
        tkSubject: "",
        tkOther: "",
      },
    ]);
  }, [setEntries]);

  /**
   * 删除句子节点
   */
  const removeSentenceNode = useCallback(
    (id: string) => {
      setEntries((current) => current.filter((entry) => entry.id !== id));
    },
    [setEntries],
  );

  /**
   * 调整句子节点的位置
   */
  const moveSentenceNode = useCallback(
    (id: string, direction: -1 | 1) => {
      setEntries((current) => {
        const index = current.findIndex((entry) => entry.id === id);
        if (index === -1) return current;

        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= current.length) return current;

        const nextEntries = [...current];
        const [entry] = nextEntries.splice(index, 1);
        nextEntries.splice(targetIndex, 0, entry);
        return nextEntries;
      });
    },
    [setEntries],
  );

  const moveSentenceNodeUp = useCallback(
    (id: string) => {
      moveSentenceNode(id, -1);
    },
    [moveSentenceNode],
  );

  const moveSentenceNodeDown = useCallback(
    (id: string) => {
      moveSentenceNode(id, 1);
    },
    [moveSentenceNode],
  );

  /**
   * 向解析器发送句子节点
   */
  const sendSentenceNode = useCallback((_id: string) => {
    // console.info("sendSentenceNode placeholder invoked", { id });
    // TODO: 功能设置为将句子中尚未解析 tkXxx 一键全部发送出去
    // 因此，需要先实现将未解析 tkXxx 发送出去的功能（在useParseSentence.ts）
  }, []);

  /**
   * 返回是否能够发送句子节点
   */
  const canSendSentenceNode = useCallback(
    (entry: SentenceNodeEntry) => !entry.sending,
    [],
  );

  /**
   * 返回句子所生成的标题
   */
  const structureSummary = useCallback(
    (entry: SentenceNodeEntry) => entry.summary,
    [],
  );

  /**
   * 更新句子节点，如果更新的内容是String则同步更新标题
   */
  const updateEntryField = useCallback(
    (
      id: string,
      field: keyof Pick<
        SentenceNodeEntry,
        "tkContext" | "tkSubject" | "tkOther"
      >,
      value: string,
    ) => {
      // 裁切函数
      const trct = (text: string): string => {
        if (text.length <= 4) return text;
        return `${text.slice(0, 3)}...`;
      };

      setEntries((current) =>
        current.map((entry) => {
          if (entry.id === id) {
            const newEntry = { ...entry, [field]: value };
            // 同步更新标题
            if (
              typeof newEntry.tkContext === "string" &&
              typeof newEntry.tkSubject === "string" &&
              typeof newEntry.tkOther === "string"
            ) {
              newEntry.summary = `${trct(newEntry.tkContext)} | ${trct(newEntry.tkSubject)} | ${trct(newEntry.tkOther)}`;
            }
            if (
              newEntry.tkContext === "" &&
              newEntry.tkSubject === "" &&
              newEntry.tkOther === ""
            )
              newEntry.summary = "（空）";
            return newEntry;
          } else {
            return entry;
          }
        }),
      );
    },
    [setEntries],
  );

  return {
    toggleSentenceNode,
    addSentenceNode,
    removeSentenceNode,
    moveSentenceNodeUp,
    moveSentenceNodeDown,
    sendSentenceNode,
    canSendSentenceNode,
    structureSummary,
    updateEntryField,
  } as const;
}

export default useSentenceNodes;
