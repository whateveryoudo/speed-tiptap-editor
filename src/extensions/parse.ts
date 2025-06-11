/*
 * @Author: ykx
 * @Date: 2023-01-06 17:31:14
 * @LastEditTime: 2023-01-09 15:53:29
 * @LastEditors: your name
 * @Description:
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\parse.ts
 */
import { Extension } from '@tiptap/core'
import { EXTENSION_PRIORITY_HIGHEST } from '@/enums/constants'
import { toggleMark } from 'prosemirror-commands'
import { Plugin, PluginKey, TextSelection } from 'prosemirror-state'
import { safeJSONParse } from '@/helpers/json'
import { handleFileEvent, isValidURL } from '@/prose-utils'
export const Parse = Extension.create({
  name: 'paste',
  priority: EXTENSION_PRIORITY_HIGHEST,
  addProseMirrorPlugins() {
    const extensionThis = this
    const { editor } = extensionThis
    return [
      new Plugin({
        key: new PluginKey('paste'),
        props: {
          handlePaste: (view, event: ClipboardEvent) => {
            if (view.props.editable && !view.props.editable(view.state)) {
              return false
            }
            if (!event.clipboardData) return false

            const files = Array.from(event.clipboardData.files)
            const node = event.clipboardData.getData('text/node')
            const text = event.clipboardData.getData('text/plain')
            const { state, dispatch } = view
            if (node) {
              const json = safeJSONParse(node)
              const tr = view.state.tr
              const selection = tr.selection
              view.dispatch(
                tr
                  .insert(selection.from - 1, view.state.schema.nodeFromJSON(json))
                  .scrollIntoView(),
              )
              return true
            }

            if (isValidURL(text)) {
              if (!state.selection.empty) {
                toggleMark(this.editor.schema.marks.link, { href: text })(state, dispatch)
                return true
              }

              const transaction = view.state.tr
                .insertText(text, state.selection.from, state.selection.to)
                .addMark(
                  state.selection.from,
                  state.selection.to + text.length,
                  state.schema.marks.link.create({ href: text }),
                )
              view.dispatch(transaction)
              return true
            }

            if (files.length) {
              event.preventDefault()
              files.forEach(file => {
                handleFileEvent({ editor, file })
              })
              return true
            }

            return false
          },
        },
      }),
    ]
  },
})
