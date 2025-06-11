<!--
 * @Author: ykx
 * @Date: 2022-12-01 09:51:46
 * @LastEditTime: 2022-12-01 10:12:24
 * @LastEditors: your name
 * @Description: 插入引用
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\blockQuote.vue
-->

<template>
  <a-tooltip title="插入引用">
    <div
      :class="['shadow-bg-wrapper', isBlockquoteActive ? 'is-active' : '', isTitleActive && 'disabled']"
      @click="toggleBlockquote"
    >
    <s-icon-font type="icon-kl-quote1"></s-icon-font>
    </div>
  </a-tooltip>
</template>
<script setup lang="ts">
import { PropType } from 'vue'
import { Editor } from '@tiptap/core'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
import { Blockquote as BlockquoteExtension } from '@/extensions/blockquote';

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const isTitleActive = useActive(props.editor, Title.name)
const toggleBlockquote = () => {
  if (isTitleActive.value) {
    return
  }
  props.editor && props.editor.chain().focus().toggleBlockquote().run()
}
const isBlockquoteActive = useActive(props.editor, BlockquoteExtension.name)
</script>

<style scoped lang="less"></style>
