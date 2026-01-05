<!--
 * @Author: ykx
 * @Date: 2022-12-01 09:51:46
 * @LastEditTime: 2022-12-01 10:12:24
 * @LastEditors: your name
 * @Description: 插入引用
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\blockQuote.vue
-->

<template>
  <a-tooltip placement="bottom" :title="disableMenu ? null : '插入引用'">
    <a-button
      type="text"
      class="shadow-btn-wrapper"
      :class="[isBlockquoteActive ? 'is-active' : '']"
      @click="toggleBlockquote"
      :disabled="disableMenu"
    >
    <s-icon-font type="icon-kl-quote1"></s-icon-font>
    </a-button>
  </a-tooltip>
</template>
<script setup lang="ts">
import { PropType, computed } from 'vue'
import { Editor } from '@tiptap/core'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
import { Blockquote as BlockquoteExtension } from '@/extensions/blockquote';
import { useSpeedEditor } from '@/hooks/useSpeedEditorContext';
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const isTitleActive = useActive(props.editor, Title.name)
const { editableCpt } = useSpeedEditor();
const disableMenu = computed(() => {
  return isTitleActive.value || !editableCpt.value
})
const toggleBlockquote = () => {
  if (isTitleActive.value) {
    return
  }
  props.editor && props.editor.chain().focus().toggleBlockquote().run()
}
const isBlockquoteActive = useActive(props.editor, BlockquoteExtension.name)
</script>

<style scoped lang="less"></style>
