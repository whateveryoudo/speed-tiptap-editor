import { Node } from '@tiptap/core'

/**
 * 无 UI 加载占位：极少持久化，补进 schema 以免未知节点报错。
 */
export const Loading = Node.create({
  name: 'loading',
  inline: true,
  group: 'inline',
  atom: true,

  addAttributes() {
    return {
      text: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-type="loading"]' }]
  },

  renderHTML({ node }) {
    return [
      'span',
      {
        'data-type': 'loading',
        'data-text': node.attrs.text,
      },
    ]
  },
})
