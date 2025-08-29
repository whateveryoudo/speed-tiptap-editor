<template>

    <a-space>
        <tempalte :key="item.key" v-for="item in tableItems" :title="item.title">
            <!-- 使用自定义组件 -->
            <template v-if="item.useComponnent">
                <component :is="item.iconRender" :action="item.action" :editor="editor" />
            </template>
            <!-- 使用配置式 -->
            <template v-else>
                <a-tooltip :title="item.title">
                    <a-button v-if="!item.children" type="text" class="shadow-btn-wrapper" :disabled="item.disabled?.(editor)"
                        @click="handleItemClick(item, $event)">
                        <component :is="item.iconRender" />
                    </a-button>
                    <!-- 带有下拉项 -->
                    <a-dropdown v-else>
                        <a-button type="text" class="shadow-btn-wrapper" :disabled="item.disabled">
                            <component :is="item.iconRender" />
                        </a-button>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item v-for="child in item.children" :key="child.key"
                                    @click="handleItemClick(child, $event)">
                                    <component :is="child.iconRender" />
                                    {{ child.title }}
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </a-tooltip>
            </template>
        </tempalte>

    </a-space>
</template>
<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import type { TableBubbleMenuItem } from './useTableBubbleMenu'
const props = defineProps<{
    editor: Editor
    tableItems: TableBubbleMenuItem[]
}>()
// 处理菜单项点击事件
const handleItemClick = (item: any, event: MouseEvent) => {

    if (item.action) {
        item.action(props.editor)
    }
}
</script>
