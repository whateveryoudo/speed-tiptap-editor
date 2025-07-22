/*
 * @Author: ykx
 * @Date: 2022-12-08 14:46:22
 * @LastEditTime: 2022-12-29 10:48:25
 * @LastEditors: your name
 * @Description: QuickInsert 扩展 - 使用 floating-ui 替代 tippy.js
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\quickInsert\index.ts
 */
import { Node } from '@tiptap/core'
import { PluginKey, Plugin } from '@tiptap/pm/state'
import { EXTENSION_PRIORITY_HIGHEST } from '@/enums/constants'
import Suggestion from '@tiptap/suggestion'
import BaseList from '@/menus/insert/baseList.vue'
import { useCommand, type SubMenuGroup } from '@/menus/insert/useCommand'
import { VueRenderer } from '@tiptap/vue-3'
import { useFloatingPopup } from '@/hooks/useFloatingPopup'

const QuickInsertPluginKey = new PluginKey('quickInsert')

const extensionName = 'quickInsert'
const { menuGroup } = useCommand()

export const QuickInsert = Node.create({
  name: extensionName,

  priority: EXTENSION_PRIORITY_HIGHEST,
  addOptions() {
    return {
      HTMLAttributes: {},
      suggestion: {
        char: '/',
        pluginKey: QuickInsertPluginKey,
        command: ({ editor, range, props }: { editor: any; range: any; props: any }) => {
          const { state, dispatch } = editor.view
          const { $head, $from, $to } = state.selection

          const end = $from.pos

          const from = $head.nodeBefore
            ? end - $head.nodeBefore.text.substring($head.nodeBefore.text.indexOf('/')).length
            : $from.start()
          const tr = state.tr.deleteRange(from, end)
          dispatch(tr)

          props?.action(editor, props.user)

          //   insertMenuLRUCache.put(props.label)
          editor?.view?.focus()
        },
      },
    }
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
      new Plugin({
        key: new PluginKey('evokeMenuPlaceholder'),
      }),
    ]
  },

  addStorage() {
    return {
      rect: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    }
  },
}).configure({
  suggestion: {
    // 这里只返回全量项(搜索操作是在组件内部执行)
    items: ({ query }: any) => {
      return menuGroup.value
    },
    render: () => {
      let component: any
      const { showPopup, updatePopupPosition, hidePopup } = useFloatingPopup({
        placement: 'bottom-start',
        offset: 4,
        padding: 8
      })

      return {
        onStart: (props: any) => {
          const isEditable = props.editor.isEditable
          if (!isEditable) return
          
          component = new VueRenderer(BaseList, {
            props: { ...props, triggerType: 'bubble' },
            editor: props.editor,
          })

          showPopup(component, props.clientRect)
        },

        onUpdate: (props: any) => {
          const isEditable = props.editor.isEditable
          if (!isEditable) return

          component.updateProps(props)

          props.editor.storage[extensionName].rect = props.clientRect()

          updatePopupPosition(props.clientRect)
        },

        onKeyDown: (props: any) => {

          if (props.event.key === 'Escape') {
            hidePopup()
            return true
          }
          return component.ref?.onKeyDown(props)
        },

        onExit: (props: any) => {
          
          hidePopup()
          component.destroy()
        },
      }
    },
  },
})
