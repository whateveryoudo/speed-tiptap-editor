<!--
 * @Author: ykx
 * @Date: 2022-11-16 18:21:23
 * @LastEditTime: 2023-01-09 11:12:21
 * @LastEditors: your name
 * @Description: 气泡工具-附件
 * @FilePath: \we-knowledge-base\src\tiptap\editor\collaboration\bubbleMenus\ImageMenu\index.vue
-->
<template>
  <BubbleContainer
    class="bubble-menu"
    :editor="editor"
    plugin-key="image-bubble-menu"
    :should-show="shouldShow"
  >
    <a-space :size="5">
      <a-tooltip title="标题">
        <div
          :class="['shadow-bg-wrapper']"
          @click="handleUpdateAttributes({ displayMode: 'title' })"
        >
          <copy-outlined />
        </div>
      </a-tooltip>
      <a-tooltip title="卡片">
        <a-button
          type="text"
          :class="['shadow-bg-wrapper', displayMode === 'card' && 'is-active']"
          @click="handleUpdateAttributes({ displayMode: 'card' })"
        >
          <CreditCardOutlined />
        </a-button>
      </a-tooltip>
      <a-divider type="vertical" />
      <a-tooltip title="预览">
        <a-button type="text" class="shadow-btn-wrapper" @click="handlePreivew">
          <eye-outlined />
        </a-button>
      </a-tooltip>
      <a-tooltip title="下载">
        <a-button
          type="text"
          class="shadow-btn-wrapper"
          @click="handleDownload"
        >
          <download-outlined />
        </a-button>
      </a-tooltip>
    </a-space>
  </BubbleContainer>
</template>

<script setup lang="ts">
import { PropType, computed } from "vue";
import { message } from "ant-design-vue";
import BubbleContainer from "../BubbleContainer.vue";
import { Attachment } from "@/extensions/attachment";
import { useAttributes } from "@/hooks/useAttributes";
import {
  DeleteOutlined,
  EyeOutlined,
  CopyOutlined,
  CreditCardOutlined,
  DownloadOutlined,
} from "@ant-design/icons-vue";
import { type Editor } from "@tiptap/core";

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
});
const attributes = useAttributes<{ fileId: string; displayMode: string }>(props.editor, Attachment.name, {
  fileId: "",
  displayMode: "title",
});
const isActiveAttachment = computed(() => {
  return props?.editor.isActive(Attachment.name) && !!attributes.value.fileId;
});

const shouldShow = () => {
  return (
    props?.editor?.isEditable &&
    !props?.editor.view.state.selection.empty &&
    isActiveAttachment.value
  );
};

// 如何预览文件？？
const handlePreivew = () => {
  message.info("功能待开发");
};
const handleDownload = () => {
  props.editor?.chain().focus().downloadAttachment(attributes.value.fileId).run();
};
// 直接调用属性更新
const handleUpdateAttributes = (attrs: any) => {
  props.editor?.chain().focus().updateAttributes(Attachment.name, attrs).run();
};
</script>

<style scoped lang="less"></style>
