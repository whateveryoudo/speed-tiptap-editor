<!--
 * @Author: ykx
 * @Date: 2022-11-15 16:39:22
 * @LastEditTime: 2022-11-17 14:29:04
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\clearNodeAndMarks.vue
-->
<template>
  <s-keymap-tip :keyMap="keyMap" :title="disableMenu ? '清除格式' : null">
    <a-button class="shadow-btn-wrapper" @click="clear"  :disabled="disableMenu" type="text">
      <s-icon-font type="icon-kl-remove-format" :size="16" />
    </a-button>
  </s-keymap-tip>
</template>

<script setup lang="ts">
import { PropType, ref, inject, computed } from 'vue'
import { type Ref } from 'vue'
import { Editor } from '@tiptap/core'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
import { getShortcutTipByKey } from '@/helpers/registKeyMap'

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const keyMap = getShortcutTipByKey('clear');
const isTitleActive = useActive(props.editor, Title.name)
const editableCpt = inject('editableCpt', ref(true)) as Ref<boolean>
const disableMenu = computed(() => {
  return isTitleActive.value || !editableCpt.value
})
const clear = () => {
  if (props.editor) {
    debugger;
    props.editor.chain().focus().unsetAllMarks().run()
    props.editor.chain().focus().clearNodes().run()
  }
}
</script>

<style scoped lang="less"></style>
