<!--
 * @Author: ykx
 * @Date: 2022-11-15 16:17:06
 * @LastEditTime: 2022-12-15 15:18:59
 * @LastEditors: your name
 * @Description: 粗体
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\bold.vue
-->
<template>
    <a-tooltip title="AI助手">
        <a-button type="text" @click="emit('showAiBubble')" class="shadow-btn-wrapper">
            <img :src="AiIcon">
        </a-button>
    </a-tooltip>
</template>

<script setup lang="ts">
import AiIcon from '@kb/assets/image/ai.svg'
import { Editor } from '@tiptap/core'

const props = withDefaults(defineProps<{
    editor: Editor,
}>(), {
    editor: () => ({}) as Editor,
})
const emit = defineEmits<{
    (e: 'showAiBubble'): void,
}>()

</script>

<style scoped lang="less"></style>