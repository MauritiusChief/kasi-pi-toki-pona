"use client";

import { PlaceholderButton } from "@/components/placeholders/PlaceholderButton";
import { ReloadDictionaryButton } from "@/components/Header/ReloadDictionaryButton";

/**
 * 字典管理栏：切换字典或者重新连接字典
 * @returns
 */
export function DictionaryControls() {
  return (
    <div className="flex flex-wrap items-center gap-2" data-testid="dictionary-controls">
      <span className="text-sm font-semibold text-gray-700">字典管理</span>
      <PlaceholderButton label="切换字典" tooltip="切换字典" />
      <ReloadDictionaryButton/>
    </div>
  );
}

export default DictionaryControls;
