// 目前
import { ref, h, computed, onUnmounted, type VNode, nextTick } from 'vue'
import { computePosition, offset, flip, shift, autoUpdate } from '@floating-ui/dom'
import type { Editor } from '@tiptap/core'
import {
  MergeCellsOutlined, SplitCellsOutlined, DeleteColumnOutlined, DeleteRowOutlined,

  InsertRowAboveOutlined, InsertRowBelowOutlined, InsertRowLeftOutlined, InsertRowRightOutlined, DeleteOutlined, TableOutlined
} from '@ant-design/icons-vue'
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
  disabled?: boolean
  action?: (tableInfo: TableNodeInfo | null) => void
}

export function useTableBubbleMenu(editor: Editor) {
  const isVisible = ref(false)
  const floatingElement = ref<HTMLElement | null>(null)
  let cleanup: (() => void) | null = null

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
      console.log('Found table node:', tableNodeDOM);
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
        flip(),
        shift({ padding: 8 })
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

  // 监听编辑器焦点事件
  const handleEditorFocus = () => {
    // 当编辑器获得焦点时，检查是否在表格内
    if (shouldShow.value) {
      showBubbleMenu()
    } else {
      hideBubbleMenu()
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

  // 注入菜单项
  const tableItems = computed((): TableBubbleMenuItem[] => {
    return [
      {
        title: '合并单元格',
        iconRender: h(MergeCellsOutlined),
        class: 'has-icon right-border',
        disabled: !editor?.can().mergeCells(),
        action: () => {
          editor?.chain().focus().mergeOrSplit().run()
        },
      },
      {
        title: '拆分单元格',
        iconRender: h(SplitCellsOutlined),
        class: 'has-icon right-border',
        disabled: !editor?.can().splitCell(),
        action: () => {
          editor?.chain().focus().splitCell().run()
        },
      },

      {
        title: '往前增加列',
        iconRender: h(InsertRowRightOutlined),
        action: () => {
          editor?.chain().focus().addColumnBefore().run()
        },
      },
      {
        title: '往后增加列',
        iconRender: h(InsertRowLeftOutlined),
        action: () => {
          editor?.chain().focus().addColumnAfter().run()
        },
      },
      {
        title: '删除列',
        iconRender: h(DeleteColumnOutlined),
        class: 'del',
        action: () => {
          editor?.chain().focus().deleteColumn().run()
        },
      },
      {
        title: '往前增加行',
        iconRender: h(InsertRowAboveOutlined),
        action: () => {
          editor?.chain().focus().addRowBefore().run()
        },
      },
      {
        title: '往后增加行',
        iconRender: h(InsertRowBelowOutlined),
        action: () => {
          editor?.chain().focus().addRowAfter().run()
        },
      },
      {
        title: '删除行',
        class: 'del',
        iconRender: h(DeleteRowOutlined),
        action: () => {
          editor?.chain().focus().deleteRow().run()
        },
      },

      {
        title: '删除表格',
        class: 'del',
        iconRender: h(DeleteOutlined),
        action: () => {
          editor?.chain().focus().deleteTable().run()
        },
      },
    ]
  })

  // 组件卸载时清理
  onUnmounted(() => {
    hideBubbleMenu()
  })

  return {
    isVisible,
    floatingElement,
    shouldShow,
    tableItems,
    getTableNodeInfo,
    showBubbleMenu,
    hideBubbleMenu,
    handleEditorFocus,
    handleSelectionUpdate,
  }
}
