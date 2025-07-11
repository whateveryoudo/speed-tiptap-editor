<!--
 * @Author: ykx
 * @Date: 2022-11-15 16:34:49
 * @LastEditTime: 2022-11-22 16:08:55
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\redo.vue
-->
<template>
  <a-tooltip title="重做">
    <a-button
      type="text"
      class="shadow-btn-wrapper"
      @click="redo"
    >
      <RedoOutlined class="text-[16px]"/>
    </a-button>
  </a-tooltip>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { Editor } from "@tiptap/core";
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
});
const redo = () => {
  props.editor && props.editor.chain().focus().redo().run();
};
</script>

<style scoped lang="less"></style>
