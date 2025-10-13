/**
 * Markdown 转换工具
 */
import MarkdownIt from 'markdown-it'
// 此方法很关键（@tiptap/core仅用于在浏览器环境使用，@tiptap/html支持两者 参考：https://tiptap.dev/docs/editor/api/utilities/html#generating-json-from-html）
import { generateJSON } from '@tiptap/core'
import type { Extensions, JSONContent } from '@tiptap/core'

// 创建 markdown-it 实例，配置与 CommonMark 兼容
const md = new MarkdownIt({
  html: true, // 允许 HTML 标签
  linkify: true, // 自动识别链接
  typographer: true, // 启用一些语言中立的替换和引号美化
  breaks: true, // 转换段落里的 '\n' 到 <br>
})

/**
 * 将 Markdown 文本转换为 HTML
 * @param markdown Markdown 文本
 * @returns HTML 字符串
 */
export function markdownToHTML(markdown: string): string {
  return md.render(markdown)
}

/**
 * 将 Markdown 文本转换为 Tiptap JSON 格式
 * @param markdown Markdown 文本
 * @param extensions Tiptap 扩展数组（用于正确解析节点）
 * @returns Tiptap JSON 内容
 */
export function markdownToJSON(markdown: string, extensions: Extensions): JSONContent {
  const html = markdownToHTML(markdown)
  return generateJSON(html, extensions)
}

/**
 * 将 Markdown 文本转换为纯文本（去除格式）
 * @param markdown Markdown 文本
 * @returns 纯文本
 */
export function markdownToText(markdown: string): string {
  const html = markdownToHTML(markdown)
  // 创建临时 DOM 元素来提取文本
  const temp = document.createElement('div')
  temp.innerHTML = html
  return temp.textContent || temp.innerText || ''
}

