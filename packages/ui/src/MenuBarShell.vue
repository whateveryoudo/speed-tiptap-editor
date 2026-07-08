<script setup lang="ts">
import { computed } from 'vue'
import { Divider, Space } from 'ant-design-vue'
import type { Component } from 'vue'
import type { InsertMenuItem, ToolBarConfig } from '@speed-tiptap-editor/shared'
import { resolveToolbarLayout } from '@speed-tiptap-editor/shared'
import InsertMenuShell from './InsertMenuShell.vue'

const props = defineProps<{
  toolbarKeys: ToolBarConfig[]
  buttons: Record<string, Component>
  insertItems?: InsertMenuItem[]
  editor: unknown
}>()

const layout = computed(() => resolveToolbarLayout(props.toolbarKeys))
</script>

<template>
  <header class="ste-menu-bar">
    <Space :size="8">
      <template v-for="item in layout" :key="item.key">
        <InsertMenuShell
          v-if="item.key === 'insert' && insertItems?.length"
          :editor="editor"
          :items="insertItems"
        />
        <component
          v-else-if="buttons[item.key]"
          :is="buttons[item.key]"
          :editor="editor"
        />
        <Divider v-if="item.showDivider" type="vertical" class="ste-menu-bar__divider" />
      </template>
    </Space>
  </header>
</template>

<style scoped>
.ste-menu-bar {
  /* 外层 SpeedEditor 已负责 header 布局，此处仅保留结构 */
  display: contents;
}
.ste-menu-bar__divider {
  margin: 0 4px;
  height: 1.2em;
}
</style>
