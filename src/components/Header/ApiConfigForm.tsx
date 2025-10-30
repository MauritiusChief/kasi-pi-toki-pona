"use client";

import { useDataContext, useStatusContext } from "@/components/ContextProvider";

/**
 * API管理栏：输入API地址(deepseek, openai, etc)和API密钥
 * @returns
 */
export function ApiConfigForm() {
  const dataContext = useDataContext()
  const statusContext = useStatusContext()

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" data-testid="api-config-form">
      <div className="col-span-1 sm:col-span-2">
        <label className="mb-1 block text-xs text-gray-500" htmlFor="api-endpoint">
          API Endpoint
        </label>
        <input
          id="api-endpoint"
          value={dataContext.api.choice}
          onChange={()=>console.log("暂不允许改变"+dataContext.api.choice)}
          type="text"
          placeholder="https://api.example.com/parse"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>
      <div className="col-span-1">
        <label className="mb-1 block text-xs text-gray-500" htmlFor="api-key">
          API Key
        </label>
        <input
          id="api-key"
          value={dataContext.api.key}
          onChange={(event) => dataContext.api.setApiKey(event.target.value)}
          type="password"
          placeholder="••••••••"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}

export default ApiConfigForm;
