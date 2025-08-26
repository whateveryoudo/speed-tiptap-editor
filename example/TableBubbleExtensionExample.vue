<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Table } from '@tiptap/extension-table'
import TableRow from '../src/extensions/tableRow'
import TableCell from '../src/extensions/tableCell'
import TableHeader from '../src/extensions/tableHeader'
import { TableBubbleMenu } from '../src/bubbleMenus/TableMenu/useTableBubbleMenu'

// 创建编辑器实例，包含表格气泡菜单扩展
const editor = new Editor({
  extensions: [
    StarterKit,
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    // 添加表格气泡菜单扩展
    TableBubbleMenu,
  ],
  content: `
    <h1>表格气泡菜单扩展测试</h1>
    <p>将光标放在表格内部，你会看到气泡菜单出现在表格上方：</p>
    <table>
      <tbody>
        <tr>
          <th>姓名</th>
          <th>年龄</th>
          <th>职业</th>
          <th>部门</th>
        </tr>
        <tr>
          <td>张三</td>
          <td>25</td>
          <td>工程师</td>
          <td>技术部</td>
        </tr>
        <tr>
          <td>李四</td>
          <td>30</td>
          <td>设计师</td>
          <td>设计部</td>
        </tr>
        <tr>
          <td>王五</td>
          <td>28</td>
          <td>产品经理</td>
          <td>产品部</td>
        </tr>
      </tbody>
    </table>
    <p>试试在表格中点击或移动光标，观察气泡菜单的显示。</p>
    <p>菜单包含以下功能：</p>
    <ul>
      <li>拆分或合并单元格</li>
      <li>增加/删除行列</li>
      <li>切换表头</li>
      <li>删除表格</li>
    </ul>
  `,
})

onBeforeUnmount(() => {
  editor.destroy()
})
</script>

