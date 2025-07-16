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
            <Bold :editor="editor" />
            <Italic :editor="editor" />
            <Underline :editor="editor" />
            <Strike :editor="editor" />
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
import { Link } from '@/extensions/link'

const OTHER_BUBBLE_MENU_TYPES = [Title.name, Link.name]
const props = withDefaults(defineProps<{
    editor: any,
}>(), {
    editor: () => ({}),
})
// editor.state 与  editor.view.state??
const shouldShow = ({ editor, state }: { editor: any; state: any }) => {
    return (
        editor.isEditable &&
        !state.selection.empty &&
        OTHER_BUBBLE_MENU_TYPES.every(type => !editor.isActive(type))
    )
}
</script>
<style scoped lang="less"></style>