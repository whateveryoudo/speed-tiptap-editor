/*
 * 编辑器侧 CodeBlock：schema 契约 + lowlight / Vue NodeView / 语言检测
 */
import { CodeBlockLowlight } from './codeBlockLowlightExtension'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Wrapper from './Wrapper.vue'
import { common, createLowlight } from 'lowlight'
import { TextSelection } from '@tiptap/pm/state'
import { LanguageDetectPlugin } from './languageDetectPlugin'

export const lowlightInstance = createLowlight(common)
lowlightInstance.registerAlias({
  html: 'xml',
  vue: 'xml',
  jsx: 'javascript',
  tsx: 'typescript',
})

export const CodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return VueNodeViewRenderer(Wrapper)
  },
  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() || []),
      LanguageDetectPlugin({
        name: this.name,
        lowlight: lowlightInstance,
      }),
    ]
  },
  addKeyboardShortcuts() {
    const parent = (this as any).parent?.call(this) || {}

    return {
      ...parent,
      'Mod-a': () => {
        const { state, dispatch } = this.editor.view
        const { selection } = state
        const { $from } = selection

        if ($from.parent.type.name === 'codeBlock') {
          const start = $from.start()
          const end = $from.end()
          const tr = state.tr.setSelection(
            TextSelection.create(state.doc, start, end),
          )
          dispatch(tr)
          return true
        }
        return false
      },
    }
  },
}).configure({
  defaultLanguage: 'plaintext',
  lowlight: lowlightInstance,
})
