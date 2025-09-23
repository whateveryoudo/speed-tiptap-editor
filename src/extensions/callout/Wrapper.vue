<template>
    <NodeViewWrapper class="callout-wrapper">
        <span v-if="node.attrs.icon" class="text-[16px] mr-2" contenteditable="false">{{ node.attrs.icon }}</span>
        <NodeViewContent class="callout-content" :style="{
            color: nodeAttrs.color,
            backgroundColor: nodeAttrs.bgColor,
        }" />
    </NodeViewWrapper>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Editor } from "@tiptap/core";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/vue-3";
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

<style lang="less">
.callout-wrapper {
    margin-bottom: 10px;
}

.callout-content {
    padding: 10px;
    border-radius: 4px;

    p {
        margin-bottom: 0 !important;
    }
}
</style>