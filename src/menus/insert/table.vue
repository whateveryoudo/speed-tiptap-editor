<!--
 * @Author: ykx
 * @Date: 2022-11-15 16:17:06
 * @LastEditTime: 2022-12-15 15:18:59
 * @LastEditors: your name
 * @Description: 表格（单独触发）
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\bold.vue
-->
<template>
  <a-tooltip title="表格">
    <a-popover trigger="click" placement="bottom" v-model:open="open">
      <template #content>
        <AutoExpandTableSelect @select="handleTableSelect" />
      </template>
      <a-button type="text" class="shadow-btn-wrapper"
        :class="[isTableActive ? 'is-active' : '', isTitleActive && 'disabled']" :disabled="isTitleActive">
        <TableOutlined />
      </a-button>
    </a-popover>
  </a-tooltip>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core'
import { TableOutlined } from '@ant-design/icons-vue'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
import AutoExpandTableSelect from './autoExpandTableSelect.vue'
import { ref } from 'vue'

const open = ref(false)

const props = withDefaults(defineProps<{
  editor: Editor,
  triggerType?: 'menu' | 'bubble'
}>(), {
  editor: () => ({}) as Editor,
  triggerType: 'menu'
})
const isTitleActive = useActive(props.editor, Title.name)
const handleTableSelect = (payload: any) => {
  if (isTitleActive.value) {
    return
  }
  // 如果没选择则默认3 * 3
  props.editor?.chain().insertTable({ rows: payload.rows || 3, cols: payload.cols || 3, withHeaderRow: true }).focus().run()
  open.value = false
}
const isTableActive = useActive(props.editor, 'table')
</script>

<style scoped lang="less"></style>
