import { Node } from '@tiptap/core'

/**
 * 无 UI 高亮块：去掉 Vue NodeView / 快捷键，供服务端 generateHTML 使用。
 */
export const Callout = Node.create({
  name: 'callout',
  priority: 1000,
  group: 'block',
  content: 'paragraph+',
  defining: true,
  selectable: true,
  isolating: true,

  addAttributes() {
    return {
      bgColor: {
        default: 'rgba(217,201,248,0.5)',
      },
      color: {
        default: '#000000',
      },
      icon: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="callout"]',
        getAttrs: (dom) => {
          const el = dom as HTMLElement
          return {
            bgColor: el.dataset.bgColor,
            color: el.dataset.color,
            icon: el.dataset.icon,
          }
        },
      },
    ]
  },

  renderHTML({ node }) {
    return [
      'div',
      {
        'data-type': 'callout',
        'data-bg-color': node.attrs.bgColor,
        'data-color': node.attrs.color,
        'data-icon': node.attrs.icon,
        style: `background-color: ${node.attrs.bgColor}; color: ${node.attrs.color};`,
      },
      0,
    ]
  },
})
