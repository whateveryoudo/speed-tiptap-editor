<!--
 * @Author: ykx
 * @Date: 2022-11-16 18:21:23
 * @LastEditTime: 2022-12-30 16:06:51
 * @LastEditors: your name
 * @Description: 气泡工具-表格
 * @FilePath: \we-knowledge-base\src\tiptap\editor\collaboration\bubbleMenus\textMenu.vue
-->
<template>
    <BubbleContainer :editor="editor" :should-show="shouldShow" plugin-key="table-bubble-menu">
        <RenderMenuItems :editor="editor" :tableItems="bubbleTableItem" />
    </BubbleContainer>
</template>

<script setup lang="ts">
import BubbleContainer from '../BubbleContainer.vue'
import RenderMenuItems from './RenderMenuItems.vue'
import { bubbleTableItem } from './useTableBubbleMenu.tsx'

const props = withDefaults(defineProps<{
    editor: any,
}>(), {
    editor: () => ({}),
})
const shouldShow = ({ editor, state }: { editor: any; state: any }) => {
    // 确保编辑器可编辑
    if (!editor?.isEditable) {
        return false
    }

    // 检查是否是单元格选择（而不是文字选择）
    return (state.selection as any).$anchorCell && (state.selection as any).$headCell
}
</script>
<style scoped lang="less"></style>