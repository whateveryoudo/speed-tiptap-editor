// 此hook为table专用固定气泡，直接点击时显示，与单元格选中和文本选中互斥
import { ref, h, computed, onUnmounted, type VNode, nextTick } from 'vue'
import { computePosition, offset, flip, shift, autoUpdate } from '@floating-ui/dom'
import type { Editor } from '@tiptap/core'
import {
  MergeCellsOutlined, SplitCellsOutlined, DeleteColumnOutlined, DeleteRowOutlined,
  AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined,
  InsertRowAboveOutlined, InsertRowBelowOutlined, InsertRowLeftOutlined, InsertRowRightOutlined, DeleteOutlined, TableOutlined,
} from '@ant-design/icons-vue'
import BackgroundColor from '@/menus/backgroundColor.vue'
// 表格节点信息接口
export interface TableNodeInfo {
  table: any // Table node
  tablePos: number // 表格在文档中的位置
  tableDOM: HTMLElement | null // 表格的 DOM 元素
  cursorPos: number // 当前光标位置
}
// 气泡菜单项接口
export interface TableBubbleMenuItem {
  iconRender: VNode
  title: string
  class?: string
  name?: string
  disabled?: ((editor: Editor) => boolean)
  useComponnent?: boolean
  key: string
  action?: (editor: Editor, payload?: any) => void;
  children?: TableBubbleMenuItem[];
}
const tableMenuItemMaps: Record<string, TableBubbleMenuItem> = {
  'align': {
    title: '对齐方式',
    key: 'align',
    iconRender: h(AlignLeftOutlined),
    children: [{
      title: '左对齐',
      key: 'align-left',
      iconRender: h(AlignLeftOutlined),
      action: (editor: Editor) => {
        editor?.chain().focus().setCellAttribute('align', 'left').run()
      },
    }, {
      title: '居中对齐',
      key: 'align-center',
      iconRender: h(AlignCenterOutlined),
      action: (editor: Editor) => {
        editor?.chain().focus().setCellAttribute('align', 'center').run()
      },
    }, {
      title: '右对齐',
      key: 'align-right',
      iconRender: h(AlignRightOutlined),
      action: (editor: Editor) => {
        editor?.chain().focus().setCellAttribute('align', 'right').run()
      },
    }],
  },
  'merge-cells': {
    title: '合并单元格',
    iconRender: h(MergeCellsOutlined),
    key: 'merge-cells',
    disabled: (editor: Editor) => !editor?.can().mergeCells(),
    action: (editor: Editor) => {
      editor?.chain().focus().mergeCells().run()
    },
  },
  'split-cells': {
    title: '拆分单元格',
    iconRender: h(SplitCellsOutlined),
    key: 'split-cells',
    disabled: (editor: Editor) => !editor?.can().splitCell(),
    action: (editor: Editor) => {
      editor?.chain().focus().splitCell().run()
    },
  },
  'background-color': {
    title: '单元格背景色',
    useComponnent: true,
    iconRender: h(BackgroundColor),
    key: 'background-color',
    action: (editor: Editor, payload: any) => {
      editor?.chain().focus().setCellAttribute('backgroundColor', payload.color).run()
    },
  },
  'add-column-before': {
    title: '往前增加列',
    iconRender: h(InsertRowRightOutlined),
    key: 'add-column-before',
    action: (editor: Editor) => {
      editor?.chain().focus().addColumnBefore().run()
    },
  },
  'add-column-after': {
    title: '往后增加列',
    iconRender: h(InsertRowLeftOutlined),
    key: 'add-column-after',
    action: (editor: Editor) => {
      editor?.chain().focus().addColumnAfter().run()
    },
  },
  'delete-column': {
    title: '删除列',
    iconRender: h(DeleteColumnOutlined),
    key: 'delete-column',
    action: (editor: Editor) => {
      editor?.chain().focus().deleteColumn().run()
    },
  },
  'add-row-before': {
    title: '往前增加行',
    iconRender: h(InsertRowAboveOutlined),
    key: 'add-row-before',
    action: (editor: Editor) => {
      editor?.chain().focus().addRowBefore().run()
    },
  },
  'add-row-after': {
    title: '往后增加行',
    iconRender: h(InsertRowBelowOutlined),
    key: 'add-row-after',
    action: (editor: Editor) => {
      editor?.chain().focus().addRowAfter().run()
    },
  },
  'delete-row': {
    title: '删除行',
    iconRender: h(DeleteRowOutlined),
    key: 'delete-row',
    action: (editor: Editor) => {
      editor?.chain().focus().deleteRow().run()
    },
  },
  'delete-table': {
    title: '删除表格',
    iconRender: h(DeleteOutlined),
    key: 'delete-table',
    action: (editor: Editor) => {
      editor?.chain().focus().deleteTable().run()
    },
  },
}
// 注入菜单项(表格最外层的气泡菜单)
export const tableItems = [
  tableMenuItemMaps['align'],
  tableMenuItemMaps['background-color'],
  tableMenuItemMaps['split-cells'],
  tableMenuItemMaps['add-column-before'],
  tableMenuItemMaps['add-column-after'],
  tableMenuItemMaps['delete-column'],
  tableMenuItemMaps['add-row-before'],
  tableMenuItemMaps['add-row-after'],
  tableMenuItemMaps['delete-row'],
  tableMenuItemMaps['delete-table'],
]
// 选中单元格的气泡菜单
export const bubbleTableItem = [
  tableMenuItemMaps['align'],
  tableMenuItemMaps['background-color'],
  tableMenuItemMaps['merge-cells'],
  tableMenuItemMaps['split-cells'],
  tableMenuItemMaps['add-column-before'],
  tableMenuItemMaps['add-column-after'],
  tableMenuItemMaps['delete-column'],
  tableMenuItemMaps['add-row-before'],
  tableMenuItemMaps['add-row-after'],
  tableMenuItemMaps['delete-row'],
  tableMenuItemMaps['delete-table'],
]
interface UseTableBubbleMenuOptions {
  scrollElem?: HTMLElement
}


// 表格固定气泡菜单

export function useTableBubbleMenu(editor: Editor, options?: UseTableBubbleMenuOptions = {}) {
  const isVisible = ref(false)
  const floatingElement = ref<HTMLElement | null>(null)
  let cleanup: (() => void) | null = null
  const { scrollElem = document.querySelector('.editor-content-wrap') } = options
  // 检查点击是否在气泡菜单外部
  const isClickOutside = (event: MouseEvent): boolean => {
    if (!floatingElement.value) return true

    // 检查点击的目标是否在气泡菜单内部
    const target = event.target as Node
    if (floatingElement.value.contains(target)) {
      return false
    }

    // 检查点击的目标是否在表格内部
    const tableInfo = getTableNodeInfo()
    if (tableInfo && tableInfo.tableDOM && tableInfo.tableDOM.contains(target)) {
      return false
    }

    // 排除 Ant Design 的 Popover/Dropdown 组件（防止气泡菜单被其他组件触发）
    const antdPopover = (target as Element).closest('.ant-popover')
    const antdDropdown = (target as Element).closest('.ant-dropdown')
    const antdTooltip = (target as Element).closest('.ant-tooltip')
    const antdModal = (target as Element).closest('.ant-modal')

    if (antdPopover || antdDropdown || antdTooltip || antdModal) {
      return false
    }

    return true
  }

  // 处理全局点击事件
  const handleGlobalClick = (event: MouseEvent) => {
    if (isVisible.value && isClickOutside(event)) {
      // 延迟关闭，避免与菜单项点击冲突
      setTimeout(() => {
        if (isVisible.value) {
          hideBubbleMenu()
        }
      }, 100)
    }
  }

  // 通过光标位置获取表格节点信息
  const getTableNodeInfo = (): TableNodeInfo | null => {
    if (!editor || !editor.state) return null

    const { selection } = editor.state
    const { $from } = selection

    // 查找光标所在的表格节点
    let tablePos = -1
    let table = null

    // 从当前位置向上查找表格节点
    for (let depth = $from.depth; depth >= 0; depth--) {
      const node = $from.node(depth)
      // 检查是否是表格相关的节点类型
      if (node.type.name === 'table') {
        table = node
        tablePos = $from.start(depth)
        break
      }
      // 如果找到了 tr、td、th 等表格相关节点，继续向上查找 table 节点
      if (['table_row', 'table_cell', 'table_header'].includes(node.type.name)) {
        continue
      }
    }

    if (!table || tablePos === -1) return null

    // 获取表格的 DOM 元素
    let tableDOM: HTMLElement | null = null
    try {
      const tableNodeDOM = editor.view.nodeDOM(tablePos) as HTMLElement
      if (tableNodeDOM && tableNodeDOM.nodeName === 'TABLE') {
        tableDOM = tableNodeDOM
      } else {
        // 如果直接获取的不是 TABLE 元素，尝试查找父级的 TABLE 元素
        let parentElement = tableNodeDOM?.parentElement
        while (parentElement && parentElement.nodeName !== 'TABLE') {
          parentElement = parentElement.parentElement
        }
        if (parentElement && parentElement.nodeName === 'TABLE') {
          tableDOM = parentElement
        }
      }
    } catch (error) {
      console.warn('Failed to get table DOM:', error)
    }
    console.log(tableDOM);
    return {
      table,
      tablePos,
      tableDOM,
      cursorPos: $from.pos
    }
  }

  // 判断是否应该显示气泡菜单
  const shouldShow = computed(() => {
    if (!editor || !editor.isEditable) return false

    const tableInfo = getTableNodeInfo()
    if (!tableInfo) return false

    // 只要光标在表格内部并且无选中项(做到3者气泡互斥)
    return editor.state.selection.empty
  })

  // 更新气泡菜单位置
  const updatePosition = async () => {
    if (!floatingElement.value) return

    const tableInfo = getTableNodeInfo()
    if (!tableInfo || !tableInfo.tableDOM) return

    const { x, y } = await computePosition(tableInfo.tableDOM, floatingElement.value, {
      placement: 'top',
      middleware: [
        offset(8),
        flip({ boundary: scrollElem! }),
        shift({ padding: 8, boundary: scrollElem! })
      ],
    })

    if (floatingElement.value) {
      Object.assign(floatingElement.value.style, {
        left: `${x}px`,
        top: `${y}px`,
      })
    }
  }

  // 显示气泡菜单
  const showBubbleMenu = async () => {
    if (!shouldShow.value) {
      hideBubbleMenu()
      return
    }

    isVisible.value = true

    // 添加全局点击事件监听器
    document.addEventListener('click', handleGlobalClick, true)
    await nextTick();
    // 使用 autoUpdate 自动更新位置(这里添加await nextick 确保dom元素存在后再计算位置)
    if (floatingElement.value) {
      const tableInfo = getTableNodeInfo()
      if (tableInfo && tableInfo.tableDOM) {
        if (cleanup) {
          cleanup()
        }

        cleanup = autoUpdate(
          tableInfo.tableDOM,
          floatingElement.value,
          updatePosition,
          {
            animationFrame: true,
          }
        )
      }
    }
  }

  // 隐藏气泡菜单
  const hideBubbleMenu = () => {
    isVisible.value = false

    // 移除全局点击事件监听器
    document.removeEventListener('click', handleGlobalClick, true)

    if (cleanup) {
      cleanup()
      cleanup = null
    }
  }

 

  // 监听编辑器选择变化
  const handleSelectionUpdate = () => {
    if (shouldShow.value) {
      showBubbleMenu()
    } else {
      hideBubbleMenu()
    }
  }



  // 组件卸载时清理
  onUnmounted(() => {
    hideBubbleMenu()
  })

  return {
    isVisible,
    floatingElement,
    shouldShow,
    getTableNodeInfo,
    showBubbleMenu,
    hideBubbleMenu,
    handleSelectionUpdate,
  }
}
