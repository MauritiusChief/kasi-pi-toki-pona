import type { DictionaryId } from "@/lib/dictionaries";
import { getDictionaryConfigById } from "@/lib/dictionaries";
import type { DictionaryContext, StatusContext } from "@/types/context";
import type { DictionaryEntry } from "@/types/dictionary";

export async function getDictionaryEntries(
  dictionaryId: DictionaryId,
): Promise<DictionaryEntry[]> {
  try {
    const dictionaryConfig = getDictionaryConfigById(dictionaryId);
    // 从公共目录获取 CSV 文件
    const response = await fetch(dictionaryConfig.file);
    if (!response.ok) {
      throw new Error(`Failed to fetch dictionary: ${response.status}`);
    }

    const csvText = await response.text();

    // 分割为行并处理
    const lines = csvText.split("\n");

    // 过滤掉空行和表头，然后映射为 DictionaryEntry 对象
    const entries: DictionaryEntry[] = lines
      .filter((line) => line.trim() !== "") // 移除空行
      .slice(1) // 移除表头（第一行）
      .map((line) => {
        const [source = "", translation = "", description = ""] =
          line.split(",");
        return {
          source: source.trim(),
          translation: translation.trim(),
          description: description.trim(),
        };
      })
      .filter((entry) => entry.source !== "" && entry.translation !== ""); // 移除源词或翻译为空的条目

    // 按 source 字段字母顺序排序
    entries.sort((a, b) => a.source.localeCompare(b.source));

    return entries;
  } catch (error) {
    console.error("Error loading dictionary entries:", error);
    // 如果加载失败，返回空数组作为降级方案
    return [];
  }
}

/**
 * 呼叫getDictionaryEntries函数，把返回的结果视状态（成功/失败）放入Context
 * @param appContext 装载字典目录的Context
 */
export async function loadDictionary(
  setContextStatus: StatusContext["setContextStatus"],
  setContextDictionary: DictionaryContext["setContextDictionary"],
  dictionaryId: DictionaryId,
) {
  // 加载中状态
  setContextStatus((previous) => ({
    ...previous,
    dictionary: { ...previous.dictionary, state: "loading" },
  }));
  try {
    const entries = await getDictionaryEntries(dictionaryId);
    // 成功加载状态
    setContextDictionary(entries);
    setContextStatus((previous) => ({
      ...previous,
      dictionary: {
        ...previous.dictionary,
        state: "success",
        totalEntries: entries.length,
      },
    }));
  } catch (error) {
    console.error("Failed to load dictionary:", error);
    // 加载失败状态
    setContextStatus((previous) => ({
      ...previous,
      dictionary: {
        ...previous.dictionary,
        state: "error",
        errorMessage: String(error),
      },
    }));
  }
}
