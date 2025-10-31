"use client";

import SentenceNodeEntriesRow from "./SentenceNodeEntryRow";
import useSentenceNodes from "@/hooks/StructureTree/useSentenceNode";
import { useDataContext } from "../ContextProvider";

/**
 * 结构树面板：可互动的层叠UI结构树
 * @returns
 */
export function StructureTreePanel() {
  const {structureTree, setContextStructureTree} = useDataContext()

  const {
    addSentenceNode
  } = useSentenceNodes(setContextStructureTree)

  return (
    <section className="flex min-h-[60vh] flex-col rounded-2xl border bg-white p-4" data-testid="structure-tree-panel">
      {/* 标题 */}
      <div className="mb-3">
        <h2 className="text-base font-semibold">结构树</h2>
        <p className="mt-0.5 text-xs text-gray-500">提示（占位）</p>
      </div>

      {/* 内容面板 */}
      <div className="max-h-96 flex flex-col gap-3 overflow-auto">
        {structureTree.length === 0 ? ( // 无句子
          <div className="rounded-lg border border-dashed border-gray-400 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
            暂无结构条目，请先解析或点击下方“添加条目”。
          </div>
        ) : ( // 有句子
          <div className="pr-1">
            <div className="space-y-2">
              {structureTree.map((structureNodeEntry, index) => (
                // 每个句子条目
                <div key={structureNodeEntry.id} className="rounded-lg border bg-white shadow-sm">
                  <SentenceNodeEntriesRow
                    entry={structureNodeEntry}
                    index={index}
                    total={structureTree.length}
                    setEntries={setContextStructureTree}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <div>
          <button
            type="button"
            onClick={addSentenceNode}
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
