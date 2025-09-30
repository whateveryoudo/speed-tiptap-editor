<template>
    <DragHandle :editor="editor" pluginKey="speed-tiptap-draghandle" @node-change="onNodeChange"
        @element-drag-start="onDragStart" @element-drag-end="onDragEnd">
        <div class="speed-drag-handle" :title="hoverNodeType ? `拖拽：${hoverNodeType}` : '拖拽'">
            <HolderOutlined />
        </div>
    </DragHandle>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue'
import type { Editor } from '@tiptap/core'
import { DragHandle } from '@tiptap/extension-drag-handle-vue-3'
import { HolderOutlined } from '@ant-design/icons-vue'

const props = defineProps({
    editor: {
        type: Object as PropType<Editor>,
        required: true,
    },
})

// 当前悬停节点类型与 DOM 高亮
const hoverNodeType = ref<string>('')
let lastHoverDom: Element | null = null

function onNodeChange(payload: { node: any; editor: Editor; pos: number } | null) {
    // 清除上一个高亮
    if (lastHoverDom) {
        lastHoverDom.classList.remove('speed-tiptap-drag-node-hover')
        lastHoverDom = null
    }
    if (!payload || !payload.node) {
        hoverNodeType.value = ''
        return
    }
    // TODO: 如何添加hover样式？？？
    hoverNodeType.value = payload.node?.type?.name || ''
    // const node = payload.editor.view.nodeDOM(payload.pos) as any;
    // console.log(node);
    // if (node) {
    //     node.classList.add('speed-tiptap-drag-node-hover')
    //     lastHoverDom = node
    // }

}

// 拖拽过程中同步一个标记，结束时折叠选区，避免文本气泡误触发
function onDragStart() {
    (props.editor as any).storage.__dragging = true
}
function onDragEnd() {
    (props.editor as any).storage.__dragging = false
}
</script>

<style scoped lang="less"></style>
