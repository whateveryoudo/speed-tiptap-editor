/*
 * @Author: ykx
 * @Date: 2022-11-11 16:10:18
 * @LastEditTime: 2023-01-09 18:58:30
 * @LastEditors: your name
 * @Description: Mention 扩展 - 使用 floating-ui 替代 tippy.js
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\mention\index.ts
 */
import BulitInMention from '@tiptap/extension-mention'
import { VueRenderer } from '@tiptap/vue-3'
import MentionList from './MentionList.vue'
import { getDatasetAttribute } from '@/prose-utils';
import { useFloatingPopup } from '@/hooks/useFloatingPopup'

const suggestion = {
  items: async ({ query }: any) => {
    // const route = Vrouter.currentRoute.value
    // // 这里传入一个较大的参数
    // const res = await getOrgUser(route?.params?.org as string, {
    //   page: 1,
    //   size: 1000
    // });
    // const data = (res.data.records || []).map(item => item.userDTO.name)
    // return data.filter(item => item.toLowerCase().startsWith(query.toLowerCase()))
    return []
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

        component = new VueRenderer(MentionList, {
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
}

export const Mention = BulitInMention.extend({
  addAttributes() {
    return {
      id: {
        default: '',
        parseHTML: getDatasetAttribute('id'),
      },
      label: {
        default: '',
        parseHTML: getDatasetAttribute('label'),
      },
    };
  },
}).configure({
  HTMLAttributes: {
    class: 'mention',
  },
  suggestion,
})
