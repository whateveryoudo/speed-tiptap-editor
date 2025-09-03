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
      <a-tooltip title="标题" v-model:open="isTitleOpen">
        <div
          :class="[
            'shadow-bg-wrapper',
            attributes.displayMode === 'title' && 'is-active',
          ]"
          @click="handleUpdateAttributes({ displayMode: 'title' })"
        >
          <ProfileOutlined />
        </div>
      </a-tooltip>
      <a-tooltip title="卡片" v-model:open="isCardOpen">
        <a-button
          type="text"
          :class="[
            'shadow-bg-wrapper',
            attributes.displayMode === 'card' && 'is-active',
          ]"
          @click="handleUpdateAttributes({ displayMode: 'card' })"
        >
          <CreditCardOutlined />
        </a-button>
      </a-tooltip>
      <a-divider type="vertical" class="menu-divider" />
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
import { PropType, computed, inject, ref, Ref } from "vue";
import BubbleContainer from "../BubbleContainer.vue";
import { Attachment } from "@/extensions/attachment";
import { useAttributes } from "@/hooks/useAttributes";
import {
  EyeOutlined,
  ProfileOutlined,
  CreditCardOutlined,
  DownloadOutlined,
} from "@ant-design/icons-vue";
import { type Editor } from "@tiptap/core";
const speedTiptapConfig = inject("speed-tiptap-config", ref({})) as Ref<any>;
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
});
const isTitleOpen = ref(false);
const isCardOpen = ref(false);
const attributes = useAttributes<{ fileId: string; displayMode: string }>(
  props.editor,
  Attachment.name,
  {
    fileId: "",
    displayMode: "title",
  }
);
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

// 调用本地服务
const handlePreivew = () => {
  const getPreviewUrl = speedTiptapConfig?.value?.apis?.getPreviewUrl;
  getPreviewUrl &&
    window.open(
      getPreviewUrl(attributes.value.fileId)
    );
};
const handleDownload = () => {
  props.editor
    ?.chain()
    .focus()
    .downloadAttachment(attributes.value.fileId)
    .run();
};
// 直接调用属性更新(目前发现bubble,会在更新属性时，导致节点失焦，然后tooltip不消失，这里提前调用关闭变量)
const handleUpdateAttributes = (attrs: any) => {
  isTitleOpen.value = false;
  isCardOpen.value = false;
  props.editor?.chain().focus().updateAttributes(Attachment.name, attrs).run();
};
</script>

<style scoped lang="less"></style>
