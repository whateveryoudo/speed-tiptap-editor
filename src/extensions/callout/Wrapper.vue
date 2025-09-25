<template>
    <NodeViewWrapper class="callout-wrapper">
        <a-flex class="callout-content" :style="{
            color: nodeAttrs.color,
            backgroundColor: nodeAttrs.bgColor,
        }">
            <span v-if="node.attrs.icon" class="text-[16px] mr-2" contenteditable="false">{{ node.attrs.icon }}</span>
            <NodeViewContent class="w-full" />
        </a-flex>

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
    border: 1px solid transparent;
    border-radius: 4px;
    margin-bottom: 10px;

    &.has-focus {
        border-color: var(--ant-color-primary);
    }

    margin-bottom: 10px;

    p {
        margin-bottom: 0 !important;
    }

    .callout-content {
        width: 100%;
        padding: 10px;
        border-radius: 4px;
    }
}
</style>