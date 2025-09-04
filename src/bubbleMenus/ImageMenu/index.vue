<!--
 * @Author: ykx
 * @Date: 2022-11-16 18:21:23
 * @LastEditTime: 2023-01-09 11:12:21
 * @LastEditors: your name
 * @Description: 气泡工具-图片
 * @FilePath: \we-knowledge-base\src\tiptap\editor\collaboration\bubbleMenus\ImageMenu\index.vue
-->
<template>
  <BubbleContainer
    :editor="editor"
    plugin-key="image-bubble-menu"
    :should-show="shouldShow"
  >
    <a-space :size="5">
      <a-tooltip title="复制">
        <div :class="['shadow-bg-wrapper']" @click="handleCopyNode(Image.name)">
          <copy-outlined />
        </div>
      </a-tooltip>
      <SpeedTooltip title="删除">
        <div :class="['shadow-bg-wrapper']" @click="handleDelNode(Image.name)">
          <delete-outlined />
        </div>
      </SpeedTooltip>
      <!-- 直接调用通用的居中配置 -->
      <align v-if="isActiveImage" :editor="editor"></align>
      <a-tooltip v-if="isActiveImage" title="预览">
        <div :class="['shadow-bg-wrapper']" @click="handlePreivew">
          <eye-outlined />
        </div>
      </a-tooltip>
    </a-space>
  </BubbleContainer>
</template>

<script setup lang="ts">
import { inject, PropType, computed, Ref, ref } from "vue";
import BubbleContainer from "../BubbleContainer.vue";
import { Image } from "@/extensions/image";
import align from "@/menus/align.vue";
import { useBubble } from "@/hooks/useBubble";
import { useAttributes } from "@/hooks/useAttributes";
import {
  DeleteOutlined,
  EyeOutlined,
  CopyOutlined,
} from "@ant-design/icons-vue";
import { type Editor } from "@tiptap/core";
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
});
const isActiveImage = computed(() => {
  return (
    props?.editor.isActive(Image.name) &&
    !!props?.editor.getAttributes(Image.name).src
  );
});

const { handleDelNode, handleCopyNode } = useBubble(props?.editor, {});
const shouldShow = () => {
  return (
    props?.editor?.isEditable &&
    !props?.editor.view.state.selection.empty &&
    isActiveImage.value
  );
};
// 图片专有
const src = useAttributes(
  props.editor,
  Image.name,
  { src: "" },
  (attrs) => attrs.src
);
const previewInstance = inject("previewInstance") as Ref<any>;
const handlePreivew = () => {
  if (previewInstance.value) {
    previewInstance.value.previewImage(src.value);
  }
};
</script>

<style scoped lang="less"></style>
