/*
 * @Author: ykx
 * @Date: 2022-11-11 16:10:18
 * @LastEditTime: 2023-01-09 18:58:30
 * @LastEditors: your name
 * @Description:
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\mention\index.ts
 */
import BulitInMention from '@tiptap/extension-mention'
import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'
import MentionList from './MentionList.vue'
import { getDatasetAttribute } from '@/prose-utils';
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
    let popup: any

    return {
      onStart: props => {
        component = new VueRenderer(MentionList, {
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
        component.updateProps(props)

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
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
