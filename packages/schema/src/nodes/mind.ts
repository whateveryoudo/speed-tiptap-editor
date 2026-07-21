import { Node, mergeAttributes } from '@tiptap/core'

export const DEFAULT_MIND_DATA = {
  root: { data: { text: '中心节点' }, children: [] },
  template: 'default',
  theme: 'fresh-purple',
  version: '1.4.43',
}

/**
 * 无 UI 脑图节点：去掉 Vue NodeView / 命令。
 */
export const Mind = Node.create({
  name: 'mind',
  group: 'block',
  selectable: true,
  atom: true,
  draggable: true,
  inline: false,

  addAttributes() {
    return {
      defaultShowPicker: {
        default: false,
      },
      createUser: {
        default: null,
      },
      width: {
        default: '100%',
        parseHTML: (el) => (el as HTMLElement).getAttribute('data-width') ?? '100%',
      },
      height: {
        default: 240,
        parseHTML: (el) => {
          const raw = (el as HTMLElement).getAttribute('data-height')
          const n = raw ? Number(raw) : 240
          return Number.isFinite(n) ? n : 240
        },
      },
      data: {
        default: DEFAULT_MIND_DATA,
        parseHTML: (el) => {
          const raw = (el as HTMLElement).getAttribute('data-data')
          if (!raw) return DEFAULT_MIND_DATA
          try {
            return JSON.parse(raw)
          } catch {
            return DEFAULT_MIND_DATA
          }
        },
      },
    }
  },

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'mind',
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[class=mind]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    const attrs: Record<string, unknown> = {
      ...HTMLAttributes,
      'data-width': node.attrs.width,
      'data-height': node.attrs.height,
      'data-data':
        typeof node.attrs.data === 'string'
          ? node.attrs.data
          : JSON.stringify(node.attrs.data ?? DEFAULT_MIND_DATA),
    }
    return ['div', mergeAttributes(this.options.HTMLAttributes, attrs)]
  },
})
