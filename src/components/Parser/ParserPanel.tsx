"use client";

import { useDataContext, useStatusContext } from "@/components/ContextProvider";
import { parseParagraph } from "@/hooks/Parser/useParseParagraph";
import { useSyncStructureTree } from "@/hooks/Parser/useSyncStructureTree";

/**
 * 解析面板：上部为输入框和发送按钮，下部为结果框/思考过程框
 * @returns
 */
export function ParserPanel() {
  const dataContext = useDataContext();
  const inputParagraph = dataContext.inputParagraph;
  const setContextInputParagraph = dataContext.setContextInputParagraph;
  const statusContext = useStatusContext();

  useSyncStructureTree({
    structureTree: dataContext.structureTree,
    setContextStructureTree: dataContext.setContextStructureTree,
    reasoningLogs: statusContext.reasoningLogs,
    setContextResoningLogs: statusContext.setContextResoningLogs,
  });

  return (
    <section
      className="flex min-h-[60vh] flex-col rounded-2xl border bg-white p-4"
      data-testid="parser-panel"
    >
      <div className="grid h-full grid-rows-2 gap-4">
        {/* 输入部分 */}
        <div className="flex flex-col">
          <div className="mb-2 flex gap-2">
            {/* 标题 */}
            <div className="w-full">
              <h2 className="text-base font-semibold">输入</h2>
              <p className="mt-0.5 text-xs text-gray-500">
                输入要分解的句子，请勿输入过于复杂（从句套从句）的句子。
              </p>
            </div>
            {/* 发送按钮 */}
            <button
              type="button"
              onClick={() => parseParagraph(dataContext, statusContext)}
              disabled={inputParagraph.sending || !inputParagraph.input}
              className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100"
              aria-label="解析句子"
            >
              {inputParagraph.sending ? (
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <title>解析中</title>
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <title>发送</title>
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
          <textarea
            value={inputParagraph.input}
            onChange={(event) =>
              setContextInputParagraph({
                ...inputParagraph,
                input: event.target.value,
              })
            }
            className="flex-1 resize-none rounded-md border px-3 py-2 text-sm"
            placeholder="例如：小孩在屋子里吃饭。"
          />
        </div>

        {/* 结果部分 */}
        <div className="flex flex-col">
          <div className="mb-2">
            <h2 className="text-base font-semibold">日志/结果</h2>
            <p className="mt-0.5 text-xs text-gray-500">
              显示思索过程/最终结果
            </p>
          </div>
          <div className="flex-1 overflow-auto rounded-md border bg-gray-50 p-3 text-sm">
            <div className="text-gray-500">
              {statusContext.reasoningLogs.map((log) => {
                const endTimeStamp = log.endAt ? log.endAt : new Date();
                const timeDuration = Math.floor(
                  (endTimeStamp.getTime() - log.startAt.getTime()) / 1000,
                );
                const tail = log.reasoning.slice(-30);
                return (
                  <div key={log.id}>
                    <div className="text-xs font-mono">
                      时长{timeDuration}s …{tail}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ParserPanel;
