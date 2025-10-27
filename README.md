# 道本之树 kasi-pi-toki-pona

这是一个使用树状结构来将自然语言（中文）解析并转化为toki pona的翻译器。

该项目使用Next.js，未来可能在Vercel上部署。

## 目录结构

- `app/page.tsx`：页面入口，组合各个功能区域。
- `app/api/*`：示例 API Route，占位符逻辑可替换为真实实现。
- `components/`：按功能区拆分的 React 组件，包括 React Context 管理全局状态。
- `hooks/`：相关的 React Hooks。
- `lib/`：工具函数。
- `types/`：共享的 TypeScript 类型定义。

## 后续工作

1. **真实数据源**：替换 `lib` 与 `hooks` 中的假数据逻辑，改为调用实际的 API 或数据库。
2. **API 安全**：在 `app/api` 路由中实现鉴权、错误处理与日志上报。
