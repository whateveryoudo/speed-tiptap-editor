/*
 * @Author: ykx
 * @Date: 2022-12-01 15:05:36
 * @LastEditTime: 2022-12-29 10:43:06
 * @LastEditors: your name
 * @Description: Emoji 扩展 - 使用 floating-ui 替代 tippy.js
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\emoji\index.ts
 */
import { Extension } from '@tiptap/core'
import { EXTENSION_PRIORITY_HIGHEST } from '@st/enums/constants'
import Suggestion from '@tiptap/suggestion'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { emojiSearch, emojisToName } from './emojis';
import { VueRenderer } from '@tiptap/vue-3'
import EmojiList from './EmojiList.vue'
import { useFloatingPopup } from '@st/hooks/useFloatingPopup'

const EmojiPluginKey = new PluginKey('emoji')

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    emoji: {
      setEmoji: (emoji: { name: string; emoji: string }) => ReturnType
    }
  }
}

export const Emoji = Extension.create({
  name: 'emoji',
  content: 'text*',
  priority: EXTENSION_PRIORITY_HIGHEST,
  
  addOptions() {
    return {
      HTMLAttributes: {},
      suggestion: {
        char: ':',
        pluginKey: EmojiPluginKey,
        command: ({ editor, range, props }: { editor: any; range: any; props: any }) => {
          editor
            .chain()
            .focus()
            .insertContentAt(range, props.emoji + ' ')
            .run()
        },
      },
    }
  },

  addCommands() {
    return {
      setEmoji:
        (emojiObject: { name: string; emoji: string }) =>
        ({ commands }) => {
          return commands.insertContent(emojiObject.emoji + ' ')
        },
    }
  },

  addProseMirrorPlugins() {
    const { editor } = this

    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),

      new Plugin({
        key: new PluginKey('emojiPlaceholder'),
        props: {},
      }),
    ]
  },
}).configure({
  suggestion: {
    items: ({ query }: { query: string }) => {
      return emojiSearch(query)
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

          component = new VueRenderer(EmojiList, {
            props,
            editor: props.editor,
          })

          showPopup(component, props.clientRect)
        },

        onUpdate: (props: any) => {
          const isEditable = props.editor.isEditable
          if (!isEditable) return

          component.updateProps(props)
          updatePopupPosition(props.clientRect)
        },

        onKeyDown: (props: any) => {
          const isEditable = props.editor.isEditable
          if (!isEditable) return

          if (props.event.key === 'Escape') {
            hidePopup()
            return true
          }
          return component.ref?.onKeyDown(props)
        },

        onExit: () => {
          hidePopup()
          component.destroy()
        },
      }
    },
  },
})
