/*
 * @Author: ykx
 * @Date: 2022-11-24 10:24:26
 * @LastEditTime: 2022-11-24 11:35:20
 * @LastEditors: your name
 * @Description:
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\trailingNode.ts
 */
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { type NodeType } from 'prosemirror-model'

interface TrailingNodeOptions {
  node: string
  notAfter: string[]
}
interface NodeTypes {
  node: any
  types: NodeType[]
}
function nodeEqualsType({ node, types }: NodeTypes) {
  return (Array.isArray(types) && types.includes(node.type)) || node.type === types
}
export const TrailingNode = Extension.create<TrailingNodeOptions>({
  name: 'trailingNode',
  addOptions() {
    return {
      node: 'paragraph',
      notAfter: ['paragraph'],
    }
  },
  addProseMirrorPlugins() {
    const plugin = new PluginKey(this.name)
    const disabledNodes = Object.entries(this.editor.schema.nodes)
      .map(([, value]) => value)
      .filter(node => this.options.notAfter.includes(node.name))
    const isEditable = this.editor.isEditable
    return [
      new Plugin({
        key: plugin,
        appendTransaction: (_, __, state) => {
          if (!isEditable) {
            return
          }
          const { tr, schema, doc } = state
          const shouldInsertNodeAtEnd = plugin.getState(state)
          const endPosition = doc.content.size
          const type = schema.nodes[this.options.node]

          if (!shouldInsertNodeAtEnd) {
            return
          }

          return tr.insert(endPosition, type.create())
        },
        state: {
          init: (_, state) => {
            if (!isEditable) {
              return
            }
            const lastNode = state.tr.doc.lastChild
            return !nodeEqualsType({ node: lastNode, types: disabledNodes })
          },
          apply: (tr, value) => {
            if (!isEditable) return value
            if (!tr.docChanged) {
              return value
            }
            const lastNode = tr.doc.lastChild as any
            return !nodeEqualsType({ node: lastNode, types: disabledNodes })
          },
        },
      }),
    ]
  },
})
