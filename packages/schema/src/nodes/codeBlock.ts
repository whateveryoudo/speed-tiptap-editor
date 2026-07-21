import { CodeBlock as TiptapCodeBlock } from '@tiptap/extension-code-block'

/**
 * 无 UI 代码块：保留与编辑器一致的 attrs，供 JSON↔HTML。
 * 编辑器侧再 extend 挂 lowlight / Vue NodeView。
 */
export const CodeBlock = TiptapCodeBlock.extend({
  isolating: true,

  addAttributes() {
    return {
      ...this.parent?.(),
      title: {
        default: null,
      },
      language: {
        default: 'plaintext',
      },
      languageAlias: {
        default: 'plaintext',
      },
      languageManual: {
        default: false,
      },
      wrap: {
        default: true,
      },
      theme: {
        default: 'atom-one-light',
      },
      isExpanded: {
        default: true,
      },
      height: {
        default: null,
      },
    }
  },
})
