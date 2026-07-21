/**
 * CSS 子路径入口（→ dist/style.css / 本地 alias）
 *
 * - 本地 src：样式随 MenuBarShell 等 Vue SFC 被业务 import 时由 Vite 注入，此处无需再 import 组件
 * - 发包 dist：由 package exports 的 ./style.css 指向构建产物
 */
export {}
