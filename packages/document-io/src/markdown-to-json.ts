import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import { generateJSON } from '@tiptap/core'
import type { Extensions, JSONContent } from '@tiptap/core'

function highlightCode(str: string, lang?: string) {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
    } catch {
      // fall through to escaped output
    }
  }
  return `<pre class="hljs"><code>${MarkdownIt().utils.escapeHtml(str)}</code></pre>`
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: highlightCode,
})

export function markdownToHTML(markdown: string): string {
  return md.render(markdown)
}

export function markdownToJSON(markdown: string, extensions: Extensions): JSONContent {
  const html = markdownToHTML(markdown)
  return generateJSON(html, extensions)
}

export function markdownToText(markdown: string): string {
  const html = markdownToHTML(markdown)
  const temp = document.createElement('div')
  temp.innerHTML = html
  return temp.textContent || temp.innerText || ''
}
