<!--
 * @Author: ykx
 * @Date: 2022-11-16 18:21:23
 * @LastEditTime: 2022-12-30 16:06:51
 * @LastEditors: your name
 * @Description: 气泡工具-文字
 * @FilePath: \we-knowledge-base\src\tiptap\editor\collaboration\bubbleMenus\textMenu.vue
-->
<template>
    <BubbleContainer :editor="editor" :should-show="shouldShow" plugin-key="text-bubble-menu">
        <a-space :size="5">
            <Bold trigger-type="bubble" :editor="editor" />
            <Italic trigger-type="bubble" :editor="editor" />
            <Underline trigger-type="bubble" :editor="editor" />
            <Strike trigger-type="bubble" :editor="editor" />
        </a-space>
    </BubbleContainer>
</template>

<script setup lang="ts">
import BubbleContainer from '../BubbleContainer.vue'
import Bold from '@/menus/bold.vue'
import Italic from '@/menus/italic.vue'
import Underline from '@/menus/underline.vue'
import Strike from '@/menus/strike.vue'
import { Title } from '@/extensions/title'
import { Tag } from '@/extensions/tag'
import { Attachment } from '@/extensions/attachment'
import { Link } from '@/extensions/link'
import { CodeBlock } from '@/extensions/codeBlock'
import { Callout } from '@/extensions/callout'
import { Image } from '@/extensions/image'
const OTHER_BUBBLE_MENU_TYPES = [Title.name, Callout.name, CodeBlock.name, Link.name, Tag.name, Attachment.name, Image.name]
const props = withDefaults(defineProps<{
    editor: any,
}>(), {
    editor: () => ({}),
})
// editor.state 与  editor.view.state??
const shouldShow = ({ editor, state }: { editor: any; state: any }) => {
    // 确保编辑器可编辑
    if (!editor.isEditable) {
        return false
    }
    
    // 确保有选择内容
    if (state.selection.empty) {
        return false
    }
    
    // 如果是单元格选择，不显示文本气泡菜单
    if ((state.selection as any).$anchorCell && (state.selection as any).$headCell) {
        return false
    }
    
    // 检查是否在其他特殊节点中
    if (OTHER_BUBBLE_MENU_TYPES.some(type => editor.isActive(type))) {
        return false
    }
    
    // 其他情况都显示文本气泡菜单
    return true
}
</script>
<style scoped lang="less"></style>