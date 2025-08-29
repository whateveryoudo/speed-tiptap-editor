<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'
import { onMounted, onUnmounted } from 'vue'
import { useTableBubbleMenu, tableItems } from './useTableBubbleMenu.tsx'
import RenderMenuItems from './RenderMenuItems.vue'
const props = defineProps<{
  editor: Editor
}>()

const {
  isVisible,
  floatingElement,
  handleEditorFocus,
  handleSelectionUpdate
} = useTableBubbleMenu(props.editor)


// 组件挂载时设置事件监听器
onMounted(() => {
  if (props.editor) {
    props.editor.on('focus', handleEditorFocus)
    props.editor.on('selectionUpdate', handleSelectionUpdate)
    // props.editor.on('blur', hideBubbleMenu)
  }
})

// 组件卸载时清理事件监听器
onUnmounted(() => {
  if (props.editor) {
    props.editor.off('focus', handleEditorFocus)
    props.editor.off('selectionUpdate', handleSelectionUpdate)
    // props.editor.off('blur', hideBubbleMenu)
  }
})
</script>

<template>
  <div v-if="isVisible" ref="floatingElement" class="bubble-menu-wrapper absolute z-[500]">
    <RenderMenuItems :editor="editor" :tableItems="tableItems" />
  </div>
</template>

<style lang="less" scoped></style>
