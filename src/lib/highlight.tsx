import { Fragment } from "react";

/**
 * 返回对应的搜索文本被高亮的字典条目行的片段
 * 比如搜索"a", 高亮"j[a]n"
 * @param param 被高亮的文本 text 和查询的字段 query
 * @returns
 */
export function HighlightedText({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  if (!query) {
    return <>{text}</>;
  }

  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  const segments: { value: string; highlighted: boolean; start: number }[] = [];
  let index = 0;

  while (index < text.length) {
    const matchIndex = normalizedText.indexOf(normalizedQuery, index);
    if (matchIndex === -1) {
      segments.push({
        value: text.slice(index),
        highlighted: false,
        start: index,
      });
      break;
    }

    if (matchIndex > index) {
      segments.push({
        value: text.slice(index, matchIndex),
        highlighted: false,
        start: index,
      });
    }

    segments.push({
      value: text.slice(matchIndex, matchIndex + normalizedQuery.length),
      highlighted: true,
      start: matchIndex,
    });
    index = matchIndex + normalizedQuery.length;
  }

  return (
    <>
      {segments.map((segment) =>
        segment.highlighted ? (
          <span key={`${segment.start}-highlighted`} className="font-bold">
            {segment.value}
          </span>
        ) : (
          <Fragment key={`${segment.start}-plain`}>{segment.value}</Fragment>
        ),
      )}
    </>
  );
}
