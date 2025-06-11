<!--
 * @Author: ykx
 * @Date: 2022-11-15 16:39:22
 * @LastEditTime: 2022-11-17 14:29:04
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\clearNodeAndMarks.vue
-->
<template>
  <a-tooltip title="格式刷">
    <div
      class="shadow-bg-wrapper"
      @click="clear"
    >
      <clear-outlined />
    </div>
  </a-tooltip>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Editor } from '@tiptap/core'
import { ClearOutlined } from '@ant-design/icons-vue'
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const clear = () => {
  if (props.editor) {
    props.editor.chain().focus().unsetAllMarks().run()
    props.editor.chain().focus().clearNodes().run()
  }
}
</script>

<style scoped lang="less"></style>
