import {
  Table as TiptapTable,
  TableCell as TiptapTableCell,
  TableHeader as TiptapTableHeader,
  TableRow as TiptapTableRow,
} from '@tiptap/extension-table'

/**
 * 无 UI 表格节点（Word / 导入共用）。
 * 编辑器侧可再 configure({ resizable: true })，服务端务必 resizable: false。
 */
export const Table = TiptapTable

export const TableRow = TiptapTableRow

export const TableHeader = TiptapTableHeader

/** 扩展对齐 / 背景色，便于 Word HTML → JSON 保留单元格样式 */
export const TableCell = TiptapTableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.align) {
            return {}
          }
          return {
            style: `text-align: ${attributes.align}`,
          }
        },
        parseHTML: (element) => {
          return element.getAttribute('align') || null
        },
      },
      backgroundColor: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) {
            return {}
          }
          return {
            style: `background-color: ${attributes.backgroundColor}`,
          }
        },
        parseHTML: (element) => {
          return element.style.backgroundColor.replace(/['"]+/g, '')
        },
      },
    }
  },
})

/** 导入用：禁止 resizable（依赖 DOM） */
export const importTableExtensions = [
  Table.configure({ resizable: false }),
  TableRow,
  TableHeader,
  TableCell,
]
