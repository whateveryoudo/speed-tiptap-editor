import Table from '@tiptap/extension-table'
import '@st/assets/style/table.less'
console.log(Table.configure, 'Table.Configure');
export default Table.configure({
  resizable: true,
  handleWidth: 5,
  lastColumnResizable: false,
  HTMLAttributes: {
    background: '',
  },
})
