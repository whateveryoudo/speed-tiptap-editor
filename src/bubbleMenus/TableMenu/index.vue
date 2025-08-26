<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'
import { onMounted, onUnmounted } from 'vue'
import Icon from './Icon.vue'
import { useTableBubbleMenu } from './useTableBubbleMenu.tsx'

const props = defineProps<{
  editor: Editor
}>()

const {
  isVisible,
  floatingElement,
  tableItems,
  shouldShow,
  showBubbleMenu,
  hideBubbleMenu,
  handleEditorFocus,
  handleSelectionUpdate
} = useTableBubbleMenu(props.editor)

// 处理菜单项点击事件
const handleItemClick = (item: any, event: MouseEvent) => {
  
  if (item.action) {
    item.action()
  }
}

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
    <a-space>
      <a-tooltip :key="item.title" v-for="item in tableItems" :title="item.title">
        <a-button type="text" class="shadow-btn-wrapper" :disabled="item.disabled" @click="handleItemClick(item, $event)">
          <component :is="item.iconRender" />
        </a-button>
      </a-tooltip>
    </a-space>
  </div>
</template>

<style lang="less" scoped>
</style>
