import MarkdownIt from 'markdown-it'
import { generateJSON } from '@tiptap/core'
import type { Extensions, JSONContent } from '@tiptap/core'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
})

/** AI 预览用：Markdown → HTML */
export function markdownToHTML(markdown: string): string {
  return md.render(markdown)
}

/** AI 插入用：Markdown → Tiptap JSON（传入 schema importKit 等） */
export function markdownToJSON(markdown: string, extensions: Extensions): JSONContent {
  const html = markdownToHTML(markdown)
  return generateJSON(html, extensions)
}
