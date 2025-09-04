<template>
  <NodeViewWrapper class="tag-wrapper">
    <span
      class="tag-node"
      :style="{
        color: nodeAttrs.color,
        backgroundColor: nodeAttrs.bgColor,
      }"
      >{{ nodeAttrs.text }}</span
    >
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Editor } from "@tiptap/core";
import { NodeViewWrapper } from "@tiptap/vue-3";
const props = withDefaults(
  defineProps<{
    node: any;
    editor: Editor;
    updateAttributes: () => Record<string, any>;
  }>(),
  {
    node: () => ({}),
    updateAttributes: () => ({}),
  }
);
const nodeAttrs = computed(() => {
  return props.node?.attrs;
});
</script>

<style lang="less" scoped>
.tag-node {
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
