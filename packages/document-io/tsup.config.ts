import { defineLibConfig } from '../../tools/tsup.lib'

export default defineLibConfig({
  external: ['@tiptap/core', 'mammoth', 'turndown', 'markdown-it', 'highlight.js', 'html-to-docx', 'html2canvas'],
})
