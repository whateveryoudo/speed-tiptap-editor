<!--
 * @Author: ykx
 * @Date: 2022-11-15 16:17:06
 * @LastEditTime: 2022-11-22 15:59:22
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\undo.vue
-->
<template>
  <a-tooltip title="撤销">
    <div
      class="shadow-bg-wrapper"
      @click="undo"
    >
    <UndoOutlined />
    </div>
  </a-tooltip>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Editor } from '@tiptap/core'
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const undo = () => {
  props.editor && props.editor.chain().focus().undo().run()
}
</script>

<style scoped lang="less"></style>
