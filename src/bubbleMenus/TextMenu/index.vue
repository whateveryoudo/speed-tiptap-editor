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
            <template v-for="item in bubbleMenuItems" :key="item">
                <template v-if="typeof item === 'string'">
                    <a-divider v-if="item === '|'" type="vertical" class="menu-divider" />
                    <component :is="bubbleMenuMap[item as keyof typeof bubbleMenuMap]" trigger-type="bubble" v-else
                        :editor="editor" />
                </template>
                <!-- 先不要选中样式 -->
                <a-tooltip v-else :title="item.title">
                    <a-button type="text" class="shadow-btn-wrapper" :class="[isTitleActive && 'disabled']"
                        @click="() => item.action?.(editor)" :disabled="isTitleActive">
                        <s-icon-font :type="item.icon" />
                    </a-button>
                </a-tooltip>
            </template>

        </a-space>
    </BubbleContainer>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
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
import FontSize from '@/menus/fontSize.vue'
import TextColor from '@/menus/textColor.vue'
import BackgroundColor from '@/menus/backgroundColor.vue'
import { type CollaborationEditorProps } from '@/type'
import { useActive } from '@/hooks/useActive'
const OTHER_BUBBLE_MENU_TYPES = [Title.name, Callout.name, CodeBlock.name, Link.name, Tag.name, Attachment.name, Image.name]
const props = withDefaults(defineProps<{
    editor: any,
    textBubbleMenu?: CollaborationEditorProps['textBubbleMenu'],
}>(), {
    editor: () => ({}),
})
const globalTiptapStorage = inject('globalTiptapStorage', ref<Record<string, any>>({}));
const bubbleMenuMap = {
    bold: Bold,
    italic: Italic,
    underline: Underline,
    strike: Strike,
    fontSize: FontSize,
    textColor: TextColor,
    backgroundColor: BackgroundColor,
}
const isTitleActive = useActive(props.editor, Title.name)
// editor.state 与  editor.view.state??
const shouldShow = ({ editor, state }: { editor: any; state: any }) => {
    // 确保编辑器可编辑
    if (!editor.isEditable) {
        return false
    }

    // 新增：拖拽场景下不显示气泡
    if (globalTiptapStorage.value.__dragging) return false

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
const defaultBubbleMenuItems = [
    'bold',
    'italic',
    'underline',
    'strike',
    'fontSize',
    'textColor',
    'backgroundColor'
]
const bubbleMenuItems = computed(() => {
    return props.textBubbleMenu?.items ?? defaultBubbleMenuItems
})
</script>
<style scoped lang="less"></style>