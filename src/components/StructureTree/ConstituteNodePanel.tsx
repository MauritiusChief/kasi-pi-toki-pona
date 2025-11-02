import type { Dispatch, SetStateAction } from "react";

import type { CstttContextNode, SentenceNodeEntry } from "@/types/structure";

// TODO: 替代SentenceNodeEntriesRow中目前仅为textarea的面板。
// 在未解析状态才为 textarea，解析后会变成一个由 CstttXxxNode 信息渲染来的面板，可以折叠和展开，其中的label为解析前的字符串的截断。

type SentenceEntriesSetter = Dispatch<SetStateAction<SentenceNodeEntry[]>>;

type CstttContextNodePanelProps = {
  entry: SentenceNodeEntry;
  onChange: (value: string) => void;
  setEntries: SentenceEntriesSetter;
};

export function CstttContextNodePanel({
  entry,
  onChange,
  setEntries,
}: CstttContextNodePanelProps) {
  if (typeof entry.tkContext === "string") {
    return (
      <div className="rounded-lg border">
        {/* 标题部分 */}
        <div className="flex items-center gap-2 px-3 py-2">
          <span className="text-xs font-medium text-gray-500">情景</span>
          <textarea
            value={entry.tkContext}
            onChange={(event) => onChange(event.target.value)}
            rows={1}
            className="w-7/9 rounded-md border px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
            placeholder="描述情景或条件"
          />
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded border text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => console.log("情景发送按钮")}
            disabled={false}
            aria-label="发送情景"
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
              <title>发送情景</title>
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  const contextNode: CstttContextNode = entry.tkContext;

  const toggleExpanded = () => {
    setEntries((current) =>
      current.map((item) => {
        if (item.id !== entry.id) return item;
        if (typeof item.tkContext === "string") return item;
        return {
          ...item,
          tkContext: {
            ...item.tkContext,
            expanded: !item.tkContext.expanded,
          },
        };
      }),
    );
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* 标题部分 */}
      <div className="flex items-center gap-2 px-3 py-2">
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded border text-gray-500 hover:bg-gray-100"
          onClick={toggleExpanded}
          aria-label={contextNode.expanded ? "收起情景" : "展开情景"}
        >
          {contextNode.expanded ? (
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title>收起情景</title>
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
              <title>展开情景</title>
              <path d="M9 6l6 6-6 6" />
            </svg>
          )}
        </button>
        <span className="text-xs font-medium text-gray-500">情景</span>
        <div className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-gray-800">
            {contextNode.label}
          </span>
        </div>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded border text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => console.log("情景发送按钮")}
          disabled={contextNode.sending}
          aria-label={contextNode.sending ? "情景发送中" : "发送情景"}
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
            <title>{contextNode.sending ? "情景发送中" : "发送情景"}</title>
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </button>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded border text-gray-600 hover:bg-gray-100"
          onClick={() => console.log("情景重置按钮")}
          aria-label="重置情景"
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
            <title>重置情景</title>
            <path d="M21 12a9 9 0 10-9 9" />
            <path d="M22 12v-7" />
            <path d="M22 12h-6" />
          </svg>
        </button>
      </div>
      {/* 底部列表 */}
      {contextNode.expanded && contextNode.content.length > 0 && (
        <div className="space-y-2 border-t border-gray-200 bg-gray-50 px-5 py-3 pl-11">
          {contextNode.content.map((node) => (
            <textarea
              key={node.id}
              value={node.label}
              readOnly
              rows={2}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CstttSubjectNodePanel() {
  return null;
}

export function CstttOtherNodePanel() {
  return null;
}
