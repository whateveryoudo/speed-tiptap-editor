/*
 * @Author: ykx
 * @Date: 2022-12-28 16:25:35
 * @LastEditTime: 2023-01-03 09:47:04
 * @LastEditors: your name
 * @Description:
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\insert\useCommand.tsx
 */
import { type Editor } from '@tiptap/core'
import { type VNode, ref, computed, inject } from 'vue'
import {
  FileImageOutlined,
  FolderOutlined,
  LinkOutlined,
  DeploymentUnitOutlined,
  TableOutlined,
} from '@ant-design/icons-vue'
import imgIcon from '@/assets/image/insert/img.svg'
import tableIcon from '@/assets/image/insert/table.svg'
import fileIcon from '@/assets/image/insert/file.svg'
import mindIcon from '@/assets/image/insert/mind.svg'
import flowIcon from '@/assets/image/insert/flow.svg'
import emojiIcon from '@/assets/image/insert/emoji.svg'
import codeBlockIcon from '@/assets/image/insert/code-block.svg'
import formulaIcon from '@/assets/image/insert/formula.svg'
export interface SubMenuGroup {
  key: string
  name: string
  size?: number
  iconRender?: (opt?: any) => VNode
  iconType?: string
  imgIcon?: any
  hasMore?: boolean
  action?: (editor: Editor, payload?: any) => void
}
export interface MenuGroup {
  key: string
  name: string
  layout?: 'horizontal' | 'vertical'
  span?: number;
  children: SubMenuGroup[]
}
export const useCommand = () => {
  // 初始化显示modal
  const updateMindState = inject('updateMindState') as any
  const updateFlowState = inject('updateFlowState') as any
  const menuGroup = ref<MenuGroup[]>([
    {
      key: 'common',
      name: '通用',
      layout: 'horizontal',
      span: 12,
      children: [
        {
          key: 'img',
          name: '图片',
          imgIcon: imgIcon,
          action: (editor,payload) => editor.chain().focus().uploadImage(payload).run(),
        },
        {
          key: 'table',
          name: '表格',
          imgIcon: tableIcon,
          hasMore: true,
          action: (editor, payload) => {
            console.log(payload);
            // 如果没选择则默认3 * 3
            editor?.chain().insertTable({ rows: payload.rows || 3, cols: payload.cols || 3, withHeaderRow: true }).focus().run()
          },
        },
        {
          key: 'file',
          name: '附件',
          imgIcon: fileIcon,
          action: (editor,payload) => editor.chain().focus().uploadAttachment(payload).run(),
        },

      ],
    },
    {
      key: 'board',
      name: '画板类',
      children: [
        {
          key: '2-1',
          name: '思维导图',
          size: 18,
          imgIcon: mindIcon,
          action: editor => {
            editor?.chain().focus().setMind().run()
            updateFlowState && updateMindState('visible', true)
            updateFlowState && updateMindState('data')
          },
        },
        {
          key: '2-2',
          name: '流程图',
          imgIcon: flowIcon,
          action: editor => {
            editor
              .chain()
              .focus()
              .setFlowMap()
              // .setFlow({ width: '100%', defaultShowPicker: true, createUser: user.id })
              .run()
            updateFlowState && updateFlowState('visible', true)
            updateFlowState && updateFlowState('data')
          },
        },
      ],
    },
  ])
  // 扁平项
  const flatLeafMenu = computed(() => {
    let tempMenus: SubMenuGroup[] = []
    menuGroup.value.forEach((pItem: MenuGroup) => {
      tempMenus = tempMenus.concat(pItem.children)
    })
    return tempMenus
  })
  return {
    menuGroup,
    flatLeafMenu,
  }
}
