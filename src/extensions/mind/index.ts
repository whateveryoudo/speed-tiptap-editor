import { IUser } from '@/types/user'
import { mergeAttributes, Node, nodeInputRule } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Wrapper from './Wrapper.vue'
import { getDatasetAttribute, nodeAttrsToDataset } from '@/prose-utils'

export const DEFAULT_MIND_DATA = {
  root: { data: { text: '中心节点' }, children: [] },
  template: 'default',
  theme: 'fresh-purple',
  version: '1.4.43',
}

export interface IMindAttrs {
  defaultShowPicker?: boolean
  createUser?: IUser['id']
  width?: number | string
  height?: number
  data?: Record<string, unknown>
  template?: string
  theme?: string
  zoom?: number
}

interface IMindOptions {
  HTMLAttributes: Record<string, any>
  getCreateUserId: () => string | number
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mind: {
      setMind: (attrs?: IMindAttrs) => ReturnType
    }
  }
}

export const Mind = Node.create<IMindOptions>({
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
        parseHTML: getDatasetAttribute('width'),
      },
      height: {
        default: 240,
        parseHTML: getDatasetAttribute('height'),
      },
      data: {
        default: DEFAULT_MIND_DATA,
        parseHTML: getDatasetAttribute('data', true),
      },
    }
  },

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'mind',
      },
      getCreateUserId: () => '',
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[class=mind]',
      },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, nodeAttrsToDataset(node)),
    ]
  },

  addCommands() {
    return {
      setMind:
        options =>
        ({ tr, commands, chain, editor }) => {
          options = options || {}
          options.data = options.data || DEFAULT_MIND_DATA

          // @ts-ignore
          if (tr.selection?.node?.type?.name == this.name) {
            return commands.updateAttributes(this.name, options)
          }

          const { selection } = editor.state

          return chain()
            .insertContent({
              type: this.name,
              attrs: options,
            })
            .run()
        },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(Wrapper)
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /^\$mind\$$/,
        type: this.type,
        getAttributes: () => {
          return {
            width: '100%',
            defaultShowPicker: true,
            createUser: this.options.getCreateUserId(),
          }
        },
      }),
    ]
  },
})
