# packages/ — Monorepo 脚手架

> Phase 0 架构预览。**禁止** `packages/core` 整包复制 `src/`。

## 包一览

| 包 | 职责 |
|----|------|
| `shared` | 类型、常量 |
| `schema` | 前后端 JSON 合同 |
| `composables` | 通用 hooks |
| `document-io` | 导入导出 |
| **`ui`** | **编辑器专用 Vue 组件**（menus、bubbleMenus、dragHandle…） |
| `kit-base` | 基础 Tiptap 插件 + 对应 UI |
| `extension-*` | 可选重型能力 |
| `base-editor` | `SpeedEditor` 壳 |
| `collaboration-editor` | 协同壳 |
| `lite-editor` / `knowledge-editor` | 业务预设组件 |

## 根 `src/` 定位

v1 单体 + **平台遗留代码**，迁移时**只摘编辑器相关**进上表各包，其余留在 `src/` 或后续剔除。

详见 `packages/ui/README.md` 迁入 / 不迁入清单。

## 本地开发

```bash
pnpm install
pnpm build
pnpm demo
```
