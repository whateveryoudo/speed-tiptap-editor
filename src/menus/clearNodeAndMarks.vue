<!--
 * @Author: ykx
 * @Date: 2022-11-15 16:39:22
 * @LastEditTime: 2022-11-17 14:29:04
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\clearNodeAndMarks.vue
-->
<template>
  <a-tooltip title="清除格式">
    <a-button
      class="shadow-btn-wrapper"
      @click="clear"
      :class="[isTitleActive && 'disabled']"
      type="text"
      :disabled="isTitleActive"
    >
      <s-icon-font type="icon-kl-remove-format" :size="16"/>
    </a-button>
  </a-tooltip>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Editor } from '@tiptap/core'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const isTitleActive = useActive(props.editor, Title.name)

const clear = () => {
  if (props.editor) {
    debugger;
    props.editor.chain().focus().unsetAllMarks().run()
    props.editor.chain().focus().clearNodes().run()
  }
}
</script>

<style scoped lang="less"></style>
