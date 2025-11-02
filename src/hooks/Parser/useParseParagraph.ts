"use client";

import { parseParagraphExamples } from "@/lib/examples/parseParagraph";
import { streamParse } from "@/lib/parseTemplate";
import type { DataContext, StatusContext } from "@/types/context";
import type { Msg } from "@/types/parse";

const examples = parseParagraphExamples
  .map(
    (example) =>
      `输入：${example.input}\n拆分为以下${example.frames.length}个“类toki pona句子单元”：\n${JSON.stringify(example.frames, null, 2)}`,
  )
  .join("\n\n");

const prompt = `你是一个语义拆分器，请将用户提供的自然语言文本按照**类toki pona三段式**逻辑拆分为若干“类toki pona句子单元”。

## 拆分逻辑（核心）
每个“类toki pona句子单元”必须包含三个槽位：
- tkContext：句子焦点信息之外的背景信息，包括但不限于情境、条件、时间、状态、铺垫等等形式（对应 toki pona 的 la 之前）
- tkSubject：当前焦点信息（行动或者被关注）的主体或施事者，可以是人、物、抽象实体、或隐含主体（对应 toki pona 主语部分）
- tkOther：当前焦点信息的剩余部分，包括但不限于主体的动作、状态等形式（对应 toki pona 的 li 以后的部分）
*某些槽位可以为空字符串。例如句子全为焦点信息时 tkContext 为空。*

## 句子拆分规则
- 当视角/焦点切换时拆句，就切分为独立单元。比如动作主体切换或者从整体聚焦到局部。
- 背景信息的判断标准是，背景信息是发出者为了让听者能够顺利理解焦点信息而补充的前置信息。

## 输出格式
返回一个 JSON 对象，其中包含一个键为 "result" 的数组，这个数组的每个元素包含 "tkContext", "tkSubject", "tkOther"。
整体结构如下：{ "result": { "tkContext": "", "tkSubject": "", "tkOther": "" }[] }

## 示例

${examples}
`;

// console.log(prompt)

export async function parseParagraph(
  dataContext: DataContext,
  statusContext: StatusContext,
) {
  const { api, inputParagraph, setContextInputParagraph } = dataContext;
  const { setContextResoningLogs } = statusContext;

  setContextInputParagraph({ ...inputParagraph, sending: true });

  const messages: Msg[] = [
    { role: "system", content: prompt },
    { role: "user", content: inputParagraph.input },
  ];

  await streamParse({
    url: "/api/parse",
    messages,
    bodyExtra: {
      apiKey: api.key,
      model: api.choice,
      reasoning: { enabled: true },
    },
    setSending: (sending) =>
      setContextInputParagraph((prev) => ({ ...prev, sending })),
    setLogs: setContextResoningLogs,
    logId: "root",

    // 如果你的后端将“思考”片段放在别的字段，可自定义 extractDelta
    // extractDelta: (obj) => ({ contentChunk: ..., reasoningChunk: ... }),

    // onEventJSON: (obj) => {
    //   // 若需要顺带处理 tokens、usage、进度等，可在这里做副作用
    //   // 比如：statusContext.setTokens(obj.usage?.total_tokens ?? 0);
    // },
  });
}
