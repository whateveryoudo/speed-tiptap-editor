/** CSS 子路径入口（→ dist/style.css / 本地 alias）
 * ui 的 scoped 样式在 src 联调时随组件 import 注入；
 * 发版时仍通过 ui/style.css 打进本包 style 产物。
 */
import '@speed-tiptap-editor/ui/style.css'
import './assets/index.less'
import 'uno.css'
