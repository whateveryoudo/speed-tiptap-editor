/*
 * @Author: ykx
 * @Date: 2022-12-08 14:46:22
 * @LastEditTime: 2022-12-29 10:48:25
 * @LastEditors: your name
 * @Description:
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\quickInsert\index.ts
 */
import { Node } from '@tiptap/core'
import { PluginKey, Plugin } from 'prosemirror-state'
import { EXTENSION_PRIORITY_HIGHEST } from '@/enums/constants'
import Suggestion from '@tiptap/suggestion'
import tippy from 'tippy.js'
import BaseList from '@/menus/insert/baseList.vue'
import { useCommand, type SubMenuGroup } from '@/menus/insert/useCommand'
import { VueRenderer } from '@tiptap/vue-3'
const QuickInsertPluginKey = new PluginKey('quickInsert')

const extensionName = 'quickInsert'
const { flatLeafMenu, menuGroup } = useCommand()
export const QuickInsert = Node.create({
  name: extensionName,

  priority: EXTENSION_PRIORITY_HIGHEST,
  addOptions() {
    return {
      HTMLAttributes: {},
      suggestion: {
        char: '/',
        pluginKey: QuickInsertPluginKey,
        command: ({ editor, range, props }) => {
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
    items: ({ query }: any) => {
      return flatLeafMenu.value.filter((item: SubMenuGroup) => {
        return item.name.startsWith(query)
      })
    },
    render: () => {
      let component: any
      let popup: any
      let isEditable: boolean

      return {
        onStart: (props: any) => {
          isEditable = props.editor.isEditable
          if (!isEditable) return
          component = new VueRenderer(BaseList, {
            props: { ...props, fullItems: menuGroup.value, noPopover: true },
            editor: props.editor,
          })

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          })
        },

        onUpdate(props) {
          if (!isEditable) return

          component.updateProps(props)

          props.editor.storage[extensionName].rect = props.clientRect()

          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          })
        },

        onKeyDown(props) {
          if (!isEditable) return

          if (props.event.key === 'Escape') {
            popup[0].hide()
            return true
          }
          return component.ref?.onKeyDown(props)
        },

        onExit() {
          if (!isEditable) return
          popup[0].destroy()
          component.destroy()
        },
      }
    },
  },
})
