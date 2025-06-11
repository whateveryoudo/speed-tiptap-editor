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
export interface SubMenuGroup {
  key: string
  name: string
  size?: number
  iconRender?: (opt?: any) => VNode
  iconType?: string
  action?: (editor: Editor) => void
}
export interface MenuGroup {
  key: number | string
  name: string
  children: SubMenuGroup[]
}
export const useCommand = () => {
  // 初始化显示modal
  const updateMindState = inject('updateMindState') as any
  const updateFlowState = inject('updateFlowState') as any
  const menuGroup = ref<MenuGroup[]>([
    {
      key: 1,
      name: '通用',
      children: [
        {
          key: '1-1',
          name: '图片',
          iconRender: () => {
            return <FileImageOutlined />
          },
          action: editor => editor.chain().focus().setEmptyImage({ width: '100%' }).run(),
        },
        {
          key: '1-2',
          name: '附件',
          iconRender: () => {
            return <FolderOutlined />
          },
          action: editor => editor.chain().focus().setAttachment().run(),
        },
        // {
        //   key: '1-3',
        //   name: '外链',
        //   iconRender: () => {
        //     return <LinkOutlined />
        //   },
        // },
        {
          key: '1-4',
          name: '表格',
          iconRender: () => {
            return <TableOutlined />
          },
          action: editor =>
            editor?.chain().insertTable({ rows: 3, cols: 4, withHeaderRow: true }).focus().run(),
        },
      ],
    },
    {
      key: 2,
      name: '画板类',
      children: [
        {
          key: '2-1',
          name: '思维导图',
          size: 18,
          iconType: 'icon-kl-mind-map',
          action: editor => {
            editor?.chain().focus().setMind().run()
            updateFlowState && updateMindState('visible', true)
            updateFlowState && updateMindState('data')
          },
        },
        {
          key: '2-2',
          name: '流程图',
          iconRender: () => {
            return <DeploymentUnitOutlined />
          },
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
