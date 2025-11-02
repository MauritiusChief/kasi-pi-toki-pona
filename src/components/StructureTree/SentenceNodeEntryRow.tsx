"use client";

import type { Dispatch, SetStateAction } from "react";
import { CstttContextNodePanel } from "@/components/StructureTree/ConstituteNodePanel";
import useSentenceNodes from "@/hooks/StructureTree/useSentenceNode";
import type { SentenceNodeEntry } from "@/types/structure";

/**
 * 句子级节点面板
 * @param props 单一条目entry 和 useSentenceNodes所使用的setEntries函数
 * @returns
 */
export function SentenceNodeEntriesRow({
  entry,
  index,
  total,
  setEntries,
}: {
  entry: SentenceNodeEntry;
  index: number;
  total: number;
  setEntries: Dispatch<SetStateAction<SentenceNodeEntry[]>>;
}) {
  const {
    toggleSentenceNode,
    removeSentenceNode,
    sendSentenceNode,
    canSendSentenceNode,
    structureSummary,
    updateEntryField,
    moveSentenceNodeUp,
    moveSentenceNodeDown,
  } = useSentenceNodes(setEntries);

  return (
    <>
      {/* 条目本体 */}
      <div className="flex items-center gap-2 px-3 py-2">
        {/* 展开/收起 + 顺序调整按钮 */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded border text-gray-500 hover:bg-gray-100"
            onClick={() => toggleSentenceNode(entry.id)}
            aria-label={entry.expanded ? "收起条目" : "展开条目"}
          >
            {entry.expanded ? (
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>收起条目</title>
                <path d="M6 9l6 6 6-6" />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>展开条目</title>
                <path d="M9 6l6 6-6 6" />
              </svg>
            )}
          </button>
          <div className="flex h-7 w-7 flex-col overflow-hidden rounded border text-gray-500">
            <button
              type="button"
              className="flex flex-1 items-center justify-center border-b border-gray-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => moveSentenceNodeUp(entry.id)}
              disabled={index === 0}
              aria-label="向上移动条目"
            >
              <svg
                className="h-3 w-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>向上移动条目</title>
                <path d="M18 15l-6-6-6 6" />
              </svg>
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => moveSentenceNodeDown(entry.id)}
              disabled={index === total - 1}
              aria-label="向下移动条目"
            >
              <svg
                className="h-3 w-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>向下移动条目</title>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        </div>
        {/* 条目标题\句子描述 */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-800">
            {structureSummary(entry)}
          </p>
        </div>
        {/* 发送按钮 */}
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded border text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => sendSentenceNode(entry.id)}
          disabled={!canSendSentenceNode(entry)}
          aria-label={entry.sending ? "发送中" : "发送条目"}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>{entry.sending ? "发送中" : "发送条目"}</title>
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </button>
        {/* 删除按钮 */}
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded border text-red-500 hover:bg-red-50"
          onClick={() => removeSentenceNode(entry.id)}
          aria-label="删除条目"
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>删除条目</title>
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      </div>
      {/* 条目展开栏 */}
      {entry.expanded && (
        <div className="space-y-3 border-t bg-gray-50 px-5 py-3">
          <CstttContextNodePanel
            entry={entry}
            onChange={(value) => updateEntryField(entry.id, "tkContext", value)}
            setEntries={setEntries}
          />
          <div className="grid grid-cols-[52px_1fr] items-start gap-2">
            <span className="pt-1 text-xs font-medium text-gray-500">主语</span>
            <textarea // TODO 更改为 ConstituteNodePanel 中的 CstttSubjectNodePanel 组件
              value={
                typeof entry.tkSubject === "string"
                  ? entry.tkSubject
                  : "type适配更新中"
              }
              onChange={(event) =>
                updateEntryField(entry.id, "tkSubject", event.target.value)
              }
              rows={2}
              className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
              placeholder="句子的主语"
            />
          </div>
          <div className="grid grid-cols-[52px_1fr] items-start gap-2">
            <span className="pt-1 text-xs font-medium text-gray-500">其他</span>
            <textarea // TODO 更改为 ConstituteNodePanel 中的 CstttOtherNodePanel 组件
              value={
                typeof entry.tkOther === "string"
                  ? entry.tkOther
                  : "type适配更新中"
              }
              onChange={(event) =>
                updateEntryField(entry.id, "tkOther", event.target.value)
              }
              rows={2}
              className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
              placeholder="其余成分"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default SentenceNodeEntriesRow;
