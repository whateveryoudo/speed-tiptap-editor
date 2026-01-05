<!--
 * @Author: ykx
 * @Date: 2024-01-01 00:00:00
 * @LastEditTime: 2024-01-01 00:00:00
 * @LastEditors: your name
 * @Description: 文件导出
 * @FilePath: \speed-tiptap-editor\src\menus\export\index.vue
-->
<template>
    <a-tooltip placement="bottom" :title="editableCpt ? '文件导出' : null">
        <a-button type="text" class="shadow-btn-wrapper" v-on="buttonEvents" :disabled="!editableCpt">
            <ExportOutlined />
        </a-button>
    </a-tooltip>
    <ExportFormatModal :editor="editor" v-model:visible="modalVisible" />
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core'
import { ExportOutlined } from '@ant-design/icons-vue'
import { useMenuButtonEvents } from '@/hooks/useMenuButtonEvents'
import ExportFormatModal from './ExportFormatModal.vue'
import { ref } from 'vue'
import { useSpeedEditor } from '@/hooks/useSpeedEditorContext';
const props = withDefaults(defineProps<{
    editor: Editor,
    triggerType?: 'menu' | 'bubble'
}>(), {
    editor: () => ({}) as Editor,
    triggerType: 'menu'
})

const modalVisible = ref(false)
const { editableCpt } = useSpeedEditor();
const buttonEvents = useMenuButtonEvents(() => {
    modalVisible.value = true
}, props.triggerType)
</script>

<style scoped lang="less"></style>
