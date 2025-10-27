import type { DictionaryEntry } from "@/types/dictionary";

export async function getDictionaryEntries(): Promise<DictionaryEntry[]> {
  try {
    // 从公共目录获取 CSV 文件
    const response = await fetch('/dictionary_default.csv');
    if (!response.ok) {
      throw new Error(`Failed to fetch dictionary: ${response.status}`);
    }

    const csvText = await response.text();

    // 分割为行并处理
    const lines = csvText.split('\n');

    // 过滤掉空行和表头，然后映射为 DictionaryEntry 对象
    const entries: DictionaryEntry[] = lines
      .filter(line => line.trim() !== '') // 移除空行
      .slice(1) // 移除表头（第一行）
      .map(line => {
        const [source = '', translation = '', description = ''] = line.split(',');
        return {
          source: source.trim(),
          translation: translation.trim(),
          description: description.trim(),
        };
      })
      .filter(entry => entry.source !== '' && entry.translation !== ''); // 移除源词或翻译为空的条目

    // 按 source 字段字母顺序排序
    entries.sort((a, b) => a.source.localeCompare(b.source));

    return entries;
  } catch (error) {
    console.error('Error loading dictionary entries:', error);
    // 如果加载失败，返回空数组作为降级方案
    return [];
  }
}
