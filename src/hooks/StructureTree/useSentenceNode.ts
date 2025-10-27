"use client";

import { Dispatch, SetStateAction, useCallback} from "react";
import { createId } from "@/lib/createId";
import { SentenceNodeEntry } from "@/types/structure";

/**
 * 使用setEntries创建管理函数，在句子一级管理结构树
 * @param setEntries 对应的setXxx函数
 * @returns
 */
export function useSentenceNodes(setEntries: Dispatch<SetStateAction<SentenceNodeEntry[]>>) {

  /**
   * 切换某一句子节点的展开/隐藏状态
   */
  const toggleSentenceNode = useCallback((id: string) => {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === id ? { ...entry, expanded: !entry.expanded } : entry
      )
    );
  }, []);

  /**
   * 添加句子节点
   */
  const addSentenceNode = useCallback(() => {
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

  /**
   * 删除句子节点
   */
  const removeSentenceNode = useCallback((id: string) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  }, []);

  /**
   * 向解析器发送句子节点
   */
  const sendSentenceNode = useCallback((id: string) => {
    console.info("sendSentenceNode placeholder invoked", { id });
  }, []);

  /**
   * 返回是否能够发送句子节点
   */
  const canSendSentenceNode = useCallback((entry: SentenceNodeEntry) => !entry.sending, []);

  /**
   * 返回句子所生成的标题
   */
  const structureSummary = useCallback((entry: SentenceNodeEntry) => entry.summary, []);

  /**
   * 更新句子节点，如果更新的内容是String则同步更新标题
   */
  const updateEntryField = useCallback(
      (id: string, field: keyof Pick<SentenceNodeEntry, "tkContext" | "tkSubject" | "tkOther">, value: string) => {
        // 裁切函数
        const trct = (text: String): String => {
          if (text.length <= 4) return text;
          return text.slice(0, 3) + '...';
        }

        setEntries((current) =>
          current.map((entry) => {
            if (entry.id === id) {
              let newEntry = { ...entry, [field]: value, }
              // 同步更新标题
              if (typeof newEntry.tkContext === 'string' && typeof newEntry.tkSubject === 'string' && typeof newEntry.tkOther === 'string') {
                newEntry.summary = `${trct(newEntry.tkContext)} | ${trct(newEntry.tkSubject)} | ${trct(newEntry.tkOther)}`
              }
              return newEntry
            } else {
              return entry
            }
          }
          )
        );
      },
      []
  );

  return {
    toggleSentenceNode,
    addSentenceNode,
    removeSentenceNode,
    sendSentenceNode,
    canSendSentenceNode,
    structureSummary,
    updateEntryField,
  } as const;
}

export default useSentenceNodes;