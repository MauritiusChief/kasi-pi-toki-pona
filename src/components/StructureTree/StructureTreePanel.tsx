"use client";

import { useStructureTreePlaceholder } from "@/hooks/useStructureTreePlaceholder";

/**
 * 结构树面板：可互动的层叠UI结构树
 * @returns
 */
export function StructureTreePanel() {
  const {
    entries,
    toggleStructureRow,
    addStructureRow,
    removeStructureRow,
    sendStructureRow,
    canSendStructureRow,
    structureSummary,
    loadingHint,
    updateEntryField,
  } = useStructureTreePlaceholder();

  return (
    <section className="flex min-h-[60vh] flex-col rounded-2xl border bg-white p-4" data-testid="structure-tree-panel">
      {/* 标题 */}
      <div className="mb-3">
        <h2 className="text-base font-semibold">结构树</h2>
        <p className="mt-0.5 text-xs text-gray-500">{loadingHint}</p>
      </div>

      {/* 内容面板 */}
      {/* TODO: 需要动态适应不同状态的结构树，所以最好做成通过一个组件获取tag们 */}
      <div className="max-h-96 flex flex-col gap-3 overflow-auto">
        {entries.length === 0 ? ( // 无句子
          <div className="rounded-lg border border-dashed border-gray-400 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
            暂无结构条目，请先解析或点击下方“添加条目”。
          </div>
        ) : ( // 有句子
          <div className="pr-1">
            <div className="space-y-2">
              {entries.map((entry) => (
                // 每个句子条目
                <div key={entry.id} className="rounded-lg border bg-white shadow-sm">
                  {/* 条目本体 */}
                  <div className="flex items-center gap-2 px-3 py-2">
                    {/* 展开/收起按钮 */}
                    <button
                      type="button"
                      className="flex h-7 w-7 items-center justify-center rounded border text-gray-500 hover:bg-gray-100"
                      onClick={() => toggleStructureRow(entry.id)}
                      aria-label={entry.expanded ? "收起条目" : "展开条目"}
                    >
                      {entry.expanded ? (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 6l6 6-6 6" />
                        </svg>
                      )}
                    </button>
                    {/* 条目标题\句子描述 */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-800">{structureSummary(entry)}</p>
                    </div>
                    {/* 发送按钮 */}
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded border text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                      onClick={() => sendStructureRow(entry.id)}
                      disabled={!canSendStructureRow(entry)}
                      aria-label={entry.sending ? "发送中" : "发送条目"}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="M12 5l7 7-7 7" />
                      </svg>
                    </button>
                    {/* 删除按钮 */}
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded border text-red-500 hover:bg-red-50"
                      onClick={() => removeStructureRow(entry.id)}
                      aria-label="删除条目"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18" />
                        <path d="M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {/* 条目展开栏 */}
                  {entry.expanded && (
                    <div className="space-y-3 border-t bg-gray-50 px-5 py-3">
                      <div className="grid grid-cols-[52px_1fr] items-start gap-2">
                        <span className="pt-1 text-xs font-medium text-gray-500">情景</span>
                        <textarea
                          value={entry.tkContext}
                          onChange={(event) => updateEntryField(entry.id, "tkContext", event.target.value)}
                          rows={2}
                          className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
                          placeholder="描述情景或条件"
                        />
                      </div>
                      <div className="grid grid-cols-[52px_1fr] items-start gap-2">
                        <span className="pt-1 text-xs font-medium text-gray-500">主语</span>
                        <textarea
                          value={entry.tkSubject}
                          onChange={(event) => updateEntryField(entry.id, "tkSubject", event.target.value)}
                          rows={2}
                          className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
                          placeholder="句子的主语"
                        />
                      </div>
                      <div className="grid grid-cols-[52px_1fr] items-start gap-2">
                        <span className="pt-1 text-xs font-medium text-gray-500">其他</span>
                        <textarea
                          value={entry.tkOther}
                          onChange={(event) => updateEntryField(entry.id, "tkOther", event.target.value)}
                          rows={2}
                          className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
                          placeholder="其余成分"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <div>
          <button
            type="button"
            onClick={addStructureRow}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            添加条目
          </button>
        </div>
      </div>
    </section>
  );
}

export default StructureTreePanel;
