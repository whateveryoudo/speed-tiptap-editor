<!--
 * @Author: ykx
 * @Date: 2022-11-15 16:34:49
 * @LastEditTime: 2022-11-22 16:08:55
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\redo.vue
-->
<template>
  <s-keymap-tip :keyMap="keyMap" :title="editableCpt ? '重做' : null">
    <a-button
      :disabled="!editableCpt"
      type="text"
      class="shadow-btn-wrapper"
      @click="redo"
    >
      <RedoOutlined class="text-[16px]"/>
    </a-button>
  </s-keymap-tip>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import { Editor } from '@tiptap/core'
import { getShortcutTipByKey } from '@speed-tiptap-editor/shared'
import { useSpeedEditor } from '@speed-tiptap-editor/composables';
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),  
  },
})
const keyMap = getShortcutTipByKey('redo');
const { editableCpt } = useSpeedEditor();

const redo = () => {
  props.editor && props.editor.chain().focus().redo().run()
}
</script>

<style scoped lang="less"></style>
