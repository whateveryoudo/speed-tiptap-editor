/*
 * @Author: ykx
 * @Date: 2022-12-01 15:05:36
 * @LastEditTime: 2022-12-29 10:43:06
 * @LastEditors: your name
 * @Description:
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\emoji\index.ts
 */
import { Node } from '@tiptap/core'
import { EXTENSION_PRIORITY_HIGHEST } from '@/enums/constants'
import Suggestion from '@tiptap/suggestion'
import tippy from 'tippy.js';
import { Plugin, PluginKey } from 'prosemirror-state'
import { emojiSearch, emojisToName } from './emojis';
import { VueRenderer } from '@tiptap/vue-3'
import EmojiList from './EmojiList.vue'
const EmojiPluginKey = new PluginKey('emoji')


declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    emoji: {
      setEmoji: (emoji: { name: string; emoji: string }) => ReturnType
    }
  }
}
export const Emoji = Node.create({
  name: 'emoji',
  content: 'text*',
  priority: EXTENSION_PRIORITY_HIGHEST,
  addOptions() {
    return {
      HTMLAttributes: {},
      suggestion: {
        char: ':',
        pluginKey: EmojiPluginKey,
        command: ({ editor, range, props }) => {
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
        emojiObject =>
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
    items: ({ query }) => {
      return emojiSearch(query)
    },
    render: () => {
      let component:any;
      let popup:any;
      let isEditable:boolean;

      return {
        onStart: props => {
          isEditable = props.editor.isEditable
          if (!isEditable) return
          console.log(props,);
          component = new VueRenderer(EmojiList, {
            props,
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
