import { computed } from 'vue'
import type { OptionMenuItem } from './type'
import type { Editor } from '@tiptap/core'
import { Table } from '@tiptap/extension-table'
import './initTableIcon.js'
// 气泡菜单元素
export interface BubbleMenuItem {
  iconType: string
  title: string
  class?: string
  name?: string
  hasArrow?: boolean
  options?: OptionMenuItem[]
  action?: () => void
}


// 接收 props
export default (props: { editor: Editor | undefined }) => {
  // 注入菜单项
  const tableItems = injectMenuItems(props)

  // 判断是否为表格选中
  const isSelectedCell = computed(() => {
    return '$anchorCell' in (props.editor?.state.selection as any)
  })
  function shouldShow(props: any) {
    console.log(props.editor.isActive(Table.name));
    return (
      props?.editor?.isEditable &&
      !props?.editor.view.state.selection.empty &&
      props.editor.isActive(Table.name)
    )
  }
  return {
    tableItems,
    isSelectedCell,
    shouldShow,
  }
}

function injectMenuItems(props: { editor: Editor | undefined }) {
  const tableItems: BubbleMenuItem[] = [
    {
      title: '拆分或合并单元格',
      iconType: 'at-merge',
      class: 'has-icon right-border',
      action() {
        props.editor?.chain().focus().mergeOrSplit().run()
      },
    },
    {
      title: '往前增加列',
      iconType: 'at-insert-right',
      action() {
        props.editor?.chain().focus().addColumnBefore().run()
      },
    },
    {
      title: '往后增加列',
      iconType: 'at-insert-left',
      action() {
        props.editor?.chain().focus().addColumnAfter().run()
      },
    },
    {
      title: '删除列',
      iconType: 'at-delete-col',
      class: 'del',
      action() {
        props.editor?.chain().focus().deleteColumn().run()
      },
    },
    {
      title: '往前增加行',
      iconType: 'at-insert-bottom',
      action() {
        props.editor?.chain().focus().addRowBefore().run()
      },
    },
    {
      title: '往后增加行',
      iconType: 'at-insert-top',
      action() {
        props.editor?.chain().focus().addRowAfter().run()
      },
    },
    {
      title: '删除行',
      class: 'del',
      iconType: 'at-delete-row',
      action() {
        props.editor?.chain().focus().deleteRow().run()
      },
    },
    {
      title: '切换表头列',
      iconType: 'at-table-left',
      action() {
        props.editor?.chain().focus().toggleHeaderColumn().run()
      },
    },
    {
      title: '切换表头行',
      iconType: 'at-table-top',
      action() {
        props.editor?.chain().focus().toggleHeaderRow().run()
      },
    },
    {
      title: '切换表头单元格',
      iconType: 'at-toggle-header',
      action() {
        props.editor?.chain().focus().toggleHeaderCell().run()
      },
    },
    {
      name: 'textAlign',
      title: '居中对齐',
      iconType: 'at-align-center',
      class: 'has-icon',
      hasArrow: true,
      options: [
        {
          label: '居左对齐',
          value: 'left',
          iconType: 'at-align-left',
          action() {
            props.editor?.chain().focus().setTextAlign('left').run()
          },
        },
        {
          label: '居中对齐',
          value: 'center',
          iconType: 'at-align-center',
          action() {
            props.editor?.chain().focus().setTextAlign('center').run()
          },
        },
        {
          label: '居右对齐',
          value: 'right',
          iconType: 'at-align-right',
          action() {
            props.editor?.chain().focus().setTextAlign('right').run()
          },
        },
      ],
    },
    {
      name: 'backgroundColor',
      title: '设置背景色',
      iconType: 'at-palette',
      class: 'has-icon right-border',
      hasArrow: true,
      options: [
        {
          label: '重置',
          value: 'inherit',
          iconType: 'at-palette',
          action() {
            props.editor?.chain().focus().setCellAttribute('backgroundColor', 'inherit').run()
          },
        },
        {
          label: '浅灰',
          value: 'rgba(191, 191, 191, 0.1)',
          iconType: 'at-palette',
          action() {
            props.editor
              ?.chain()
              .focus()
              .setCellAttribute('backgroundColor', 'rgba(191, 191, 191, 0.1)')
              .run()
          },
        },
        {
          label: '浅红',
          value: 'rgba(230, 36, 18, 0.1)',
          iconType: 'at-palette',
          action() {
            props.editor
              ?.chain()
              .focus()
              .setCellAttribute('backgroundColor', 'rgba(230, 36, 18, 0.1)')
              .run()
          },
        },
        {
          label: '浅橙',
          value: 'rgba(250, 140, 21, 0.1)',
          iconType: 'at-palette',
          action() {
            props.editor
              ?.chain()
              .focus()
              .setCellAttribute('backgroundColor', 'rgba(250, 140, 21, 0.1)')
              .run()
          },
        },
        {
          label: '浅黄',
          value: 'rgba(250, 212, 20, 0.1)',
          iconType: 'at-palette',
          action() {
            props.editor
              ?.chain()
              .focus()
              .setCellAttribute('backgroundColor', 'rgba(250, 212, 20, 0.1)')
              .run()
          },
        },
        {
          label: '浅绿',
          value: 'rgba(47, 189, 179, 0.1)',
          iconType: 'at-palette',
          action() {
            props.editor
              ?.chain()
              .focus()
              .setCellAttribute('backgroundColor', 'rgba(47, 189, 179, 0.1)')
              .run()
          },
        },
        {
          label: '浅蓝',
          value: 'rgba(27, 154, 238, 0.1)',
          iconType: 'at-palette',
          action() {
            props.editor
              ?.chain()
              .focus()
              .setCellAttribute('backgroundColor', 'rgba(27, 154, 238, 0.1)')
              .run()
          },
        },
        {
          label: '浅紫',
          value: 'rgba(110, 116, 224, 0.1)',
          iconType: 'at-palette',
          action() {
            props.editor
              ?.chain()
              .focus()
              .setCellAttribute('backgroundColor', 'rgba(110, 116, 224, 0.1)')
              .run()
          },
        },
      ],
    },
    {
      title: '删除表格',
      iconType: 'at-del',
      class: 'del',
      action() {
        props.editor?.chain().focus().deleteTable().run()
      },
    },
  ]

  return tableItems
}
