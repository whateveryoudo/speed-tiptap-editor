/**
 * 思维导图插件接入示例（仅供参考，不参与构建）。
 *
 * 用法：
 * 1. 调研并选定第三方库
 * 2. 实现 MindEditorAdapter
 * 3. createKnowledgeEditorPlugins({ mind: true, mindAdapter: myAdapter })
 *
 * @see ./types.ts
 * @see ../README.md
 */

import type { Node } from '@tiptap/core'
import { mergeAttributes, Node as TiptapNode } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import type { MindEditorAdapter } from './types'

// --- 1. 定义 Tiptap Node（NodeView 内挂载第三方库） ---

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createMindNode(_adapter: MindEditorAdapter) {
  return TiptapNode.create({
    name: 'mind',
    group: 'block',
    atom: true,
    draggable: true,

    addAttributes() {
      return {
        data: { default: null },
        width: { default: '100%' },
        height: { default: 400 },
      }
    },

    parseHTML() {
      return [{ tag: 'div[data-type="mind"]' }]
    },

    renderHTML({ HTMLAttributes }) {
      return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'mind' })]
    },

    // addNodeView() {
    //   return VueNodeViewRenderer(MindWrapperVue) // Wrapper 内 init 第三方库
    // },

    addCommands() {
      return {
        setMind:
          (attrs) =>
          ({ commands }) =>
            commands.insertContent({ type: this.name, attrs: attrs ?? {} }),
      }
    },
  })
}

// --- 2. 实现 Adapter ---

export const exampleMindAdapter: MindEditorAdapter = {
  id: 'example-simple-mind-map',

  createExtensions(_ctx) {
    // return [createMindNode(this)]
    return []
  },

  insertMind(editor, attrs) {
    editor.chain().focus().insertContent({ type: 'mind', attrs: attrs ?? {} }).run()
  },
}

// --- 3. 注册为 SpeedEditorPlugin ---

// export function createMindPlugin(options: { adapter: MindEditorAdapter }) {
//   const { adapter } = options
//   return {
//     name: 'mind',
//     extensions: (ctx) => adapter.createExtensions(ctx),
//     insertItems: [{
//       key: 'mind',
//       label: '思维导图',
//       order: 20,
//       action: (editor) => adapter.insertMind(editor),
//     }],
//   }
// }

export type { Node }
