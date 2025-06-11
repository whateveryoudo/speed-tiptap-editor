<!--
 * @Author: ykx
 * @Date: 2022-12-01 10:03:38
 * @LastEditTime: 2022-12-01 10:14:11
 * @LastEditors: your name
 * @Description: 插入分割线
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\horizontalRule.vue
-->
<template>
  <a-tooltip title="插入分割线">
    <div :class="['shadow-bg-wrapper', isTitleActive && 'disabled']" @click="setHorizontalRule">
      <s-icon-font type="icon-kl-line" :size="18"></s-icon-font>
    </div>
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
const setHorizontalRule = () => {
  if (isTitleActive.value) {
    return
  }
  props.editor && props.editor.chain().focus().setHorizontalRule().run()
}
</script>

<style scoped lang="less"></style>
