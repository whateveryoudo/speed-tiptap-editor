import TableCell from '@tiptap/extension-table-cell'

export default TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
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
