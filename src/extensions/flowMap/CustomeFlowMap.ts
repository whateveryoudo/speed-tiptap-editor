/*
 * @Author: ykx
 * @Date: 2022-11-23 11:03:56
 * @LastEditTime: 2022-12-28 10:23:54
 * @LastEditors: your name
 * @Description:
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\flowMap\CustomeFlowMap.ts
 */
import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CustomeFlowMap from './CustomeFlowMap.vue'
import { nodeInputRule } from '@tiptap/core'
import { TextSelection } from 'prosemirror-state'
export interface FlowMapOptions {
  HTMLAttributes: Record<string, any>
}
export interface IFlowAttrs {
  width?: number | string
  height?: number
  data?: string
  defaultShowPicker?: boolean
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    flowMap: {
      setFlowMap: (attrs?: IFlowAttrs) => ReturnType
      setFlowDataSource: (dataSoruce: string) => ReturnType
    }
  }
}

export default Node.create({
  name: 'flowMap',

  group: 'block',

  addCommands() {
    return {
      setFlowDataSource:
        (dataSource: string) =>
        ({ commands }: any) => {
          return commands.updateAttributes(this.name, { dataSource })
        },
      setFlowMap:
        (options: any) =>
        ({ chain }: any) => {
          options = options || {}
          options.dataSource = options.dataSource || ''
          return chain()
            .insertContent({
              type: this.name,
              attrs: options,
            })
            .run()
        },
    }
  },
  addAttributes() {
    return {
      dataSource: {
        default: '',
      },
      width: {
        default: '100%',
      },
      height: {
        default: 240,
      },
    }
  },
  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [{ tag: 'flow-map' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['flow-map', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(CustomeFlowMap)
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /^(?::fm\s)$/,
        type: this.type,
      }),
    ]
  },
})
