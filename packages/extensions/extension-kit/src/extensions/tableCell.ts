import { TableCell } from '@tiptap/extension-table'
// 
export default TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: null,
        renderHTML: attributes => {
          if (!attributes.align) {
            return {}
          }
          return {
            style: `text-align: ${attributes.align}`,
          }
        },
        parseHTML: element => {
          return element.getAttribute('align') || null
        },
      },
      backgroundColor: {
        default: null,
        renderHTML: attributes => {
          if (!attributes.backgroundColor) {
            return {}
          }
          return {
            style: `background-color: ${attributes.backgroundColor}`,
          }
        },
        parseHTML: element => {
          return element.style.backgroundColor.replace(/['"]+/g, '')
        },
      },
    }
  },
})
