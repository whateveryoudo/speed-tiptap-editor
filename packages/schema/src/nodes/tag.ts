import { Node } from '@tiptap/core'

/**
 * 无 UI 标签节点：去掉 Vue NodeView / 插入命令。
 */
export const Tag = Node.create({
  name: 'tag',
  content: '',
  atom: true,
  draggable: false,
  selectable: true,
  marks: '',
  group: 'inline',
  inline: true,
  isolating: true,

  addAttributes() {
    return {
      text: {
        default: '标签内容',
      },
      color: {
        default: '#000000',
      },
      bgColor: {
        default: 'rgba(0, 0, 0, 0.05)',
      },
    }
  },

  renderHTML({ node }) {
    return [
      'span',
      {
        'data-type': 'tag',
        style: `color: ${node.attrs.color}; background-color: ${node.attrs.bgColor};`,
      },
      node.attrs.text,
    ]
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="tag"]',
        getAttrs: (dom) => {
          const el = dom as HTMLElement
          return {
            text: el.textContent || '标签内容',
            color: el.style.color || '#000000',
            bgColor: el.style.backgroundColor || 'rgba(0, 0, 0, 0.05)',
          }
        },
      },
    ]
  },
})
