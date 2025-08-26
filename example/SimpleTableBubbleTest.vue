<template>
  <div class="simple-table-bubble-test">
    <h2>简单表格气泡菜单测试</h2>
    <div class="editor-container">
      <EditorContent :editor="editor" />
      <FloatingTableBubble :editor="editor" />
    </div>
    
    <div class="info-panel">
      <h3>使用说明</h3>
      <ul>
        <li>点击表格内部，会自动显示气泡菜单</li>
        <li>菜单使用 @floating-ui/dom 精确定位</li>
        <li>基于编辑器焦点事件触发</li>
        <li>更简单直接的实现方式</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Table } from '@tiptap/extension-table'
import TableRow from '../src/extensions/tableRow'
import TableCell from '../src/extensions/tableCell'
import TableHeader from '../src/extensions/tableHeader'
import FloatingTableBubble from '../src/bubbleMenus/TableMenu/FloatingTableBubble.vue'

// 创建编辑器实例
const editor = new Editor({
  extensions: [
    StarterKit,
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
  ],
  content: `
    <h1>简单表格气泡菜单测试</h1>
    <p>点击表格内部，你会看到气泡菜单出现在表格上方：</p>
    <table>
      <tbody>
        <tr>
          <th>姓名</th>
          <th>年龄</th>
          <th>职业</th>
        </tr>
        <tr>
          <td>张三</td>
          <td>25</td>
          <td>工程师</td>
        </tr>
        <tr>
          <td>李四</td>
          <td>30</td>
          <td>设计师</td>
        </tr>
      </tbody>
    </table>
    <p>试试点击表格中的不同位置，观察气泡菜单的显示。</p>
  `,
})

onBeforeUnmount(() => {
  editor.destroy()
})
</script>

<style scoped lang="less">
.simple-table-bubble-test {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;

  h2 {
    color: #333;
    margin-bottom: 20px;
  }

  .editor-container {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    background: #fff;
    position: relative;

    :deep(.ProseMirror) {
      outline: none;
      min-height: 300px;

      table {
        border-collapse: collapse;
        margin: 0;
        overflow: hidden;
        table-layout: fixed;
        width: 100%;

        td,
        th {
          border: 2px solid #ced4da;
          box-sizing: border-box;
          min-width: 1em;
          padding: 3px 5px;
          position: relative;
          vertical-align: top;

          > * {
            margin-bottom: 0;
          }
        }

        th {
          background-color: #f1f3f4;
          font-weight: bold;
        }
      }
    }
  }

  .info-panel {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 20px;

    h3 {
      margin-top: 0;
      color: #495057;
    }

    ul {
      margin: 0;
      padding-left: 20px;

      li {
        margin-bottom: 8px;
        color: #495057;
      }
    }
  }
}
</style>

