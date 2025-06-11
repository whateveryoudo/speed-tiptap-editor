<template>
  <div class="editor-container">
    <SpeedTiptapEditor
      v-model:content="content"
      @update="onUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SpeedTiptapEditor } from '@/main'
// import StarterKit from '@tiptap/starter-kit'
// import Image from '@tiptap/extension-image'
// import Link from '@tiptap/extension-link'
// import TextAlign from '@tiptap/extension-text-align'
// import Table from '@tiptap/extension-table'
// import TableRow from '@tiptap/extension-table-row'
// import TableCell from '@tiptap/extension-table-cell'
// import TableHeader from '@tiptap/extension-table-header'
import type { Editor } from '@tiptap/core'

// 编辑器内容
const content = ref('<p>欢迎使用 Speed Tiptap Editor！</p>')

// 工具栏配置
const toolbar = [
  'bold',
  'italic',
  'strike',
  'heading',
  '|',
  'bulletList',
  'orderedList',
  '|',
  'link',
  'image',
  'table',
  '|',
  'textAlign',
  '|',
  'undo',
  'redo'
]

// 扩展配置
// const extensions = [
//   StarterKit,
//   Image,
//   Link.configure({
//     openOnClick: false,
//     HTMLAttributes: {
//       rel: 'noopener noreferrer',
//       class: 'editor-link'
//     }
//   }),
//   TextAlign.configure({
//     types: ['heading', 'paragraph']
//   }),
//   Table.configure({
//     resizable: true
//   }),
//   TableRow,
//   TableCell,
//   TableHeader
// ]

// 编辑器更新事件处理
const onUpdate = ({ editor }: { editor: Editor }) => {
  console.log('编辑器内容已更新:', editor.getHTML())
}
</script>

<style scoped>



</style>
