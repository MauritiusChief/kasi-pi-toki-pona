import { AppContextData, AppContextType } from "@/components/ContextProvider";
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

/**
 * 呼叫getDictionaryEntries函数，把返回的结果视状态（成功/失败）放入Context
 * @param appContext 装载字典目录的Context
 */
export async function loadDictionary(appContext: AppContextType) {
  const contextData = appContext.data;
  const setContextData = appContext.setContextData;

  // 加载中状态
  const newContextData: AppContextData = {...contextData,
    status: { ...contextData.status,
      dictionary: { ...contextData.status.dictionary, state: "loading" }
    }
  };
  setContextData(newContextData)
  try {
    const entries = await getDictionaryEntries();
    // 成功加载状态
    const successContextData: AppContextData = {...contextData,
      dictionaryEntries: entries,
      status: { ...contextData.status,
        dictionary: { ...contextData.status.dictionary, state: "success", totalEntries: entries.length }
      }
    };
    setContextData(successContextData )
  } catch (error) {
    console.error("Failed to load dictionary:", error);
    // 加载失败状态
    const errorContextData: AppContextData = {...contextData,
      status: { ...contextData.status,
        dictionary: { ...contextData.status.dictionary, state: "error", errorMessage: String(error) }
      }
    };
    setContextData(errorContextData)
  }
}