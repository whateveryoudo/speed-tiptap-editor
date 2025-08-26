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
        <a-space :size="5">
            <span>表格操作菜单</span>
            <a-button type="text" size="small">合并单元格</a-button>
            <a-button type="text" size="small">删除行</a-button>
            <a-button type="text" size="small">删除列</a-button>
        </a-space>
    </BubbleContainer>
</template>

<script setup lang="ts">
import BubbleContainer from '../BubbleContainer.vue'
import Bold from '@/menus/bold.vue'
import Italic from '@/menus/italic.vue'
import Underline from '@/menus/underline.vue'
import Strike from '@/menus/strike.vue'
import { Table } from "@tiptap/extension-table";
import { Title } from '@/extensions/title'
import { Link } from '@/extensions/link'
import { Image } from '@/extensions/image'
import { Paragraph } from '@/extensions/paragraph'
const OTHER_BUBBLE_MENU_TYPES = [Title.name, Link.name, Image.name]
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