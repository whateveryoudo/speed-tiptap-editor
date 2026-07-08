<!--
 * @Author: ykx
 * @Date: 2022-11-16 18:21:23
 * @LastEditTime: 2023-01-09 11:12:21
 * @LastEditors: your name
 * @Description: 气泡工具-附件
 * @FilePath: \we-knowledge-base\src\tiptap\editor\collaboration\bubbleMenus\ImageMenu\index.vue
-->
<template>
  <BubbleContainer :editor="editor" plugin-key="image-bubble-menu" :should-show="shouldShow">
    <a-space :size="5">
      <a-tooltip title="标题" v-if="editableCpt">
        <div :class="[
          'shadow-bg-wrapper',
          attributes.displayMode === 'title' && 'is-active',
        ]" @click="handleUpdateAttributes({ displayMode: 'title' })">
          <ProfileOutlined />
        </div>
      </a-tooltip>
      <a-tooltip title="卡片" v-if="editableCpt">
        <a-button type="text" :class="[
          'shadow-bg-wrapper',
          attributes.displayMode === 'card' && 'is-active',
        ]" @click="handleUpdateAttributes({ displayMode: 'card' })">
          <CreditCardOutlined />
        </a-button>
      </a-tooltip>
      <a-divider type="vertical" class="menu-divider" v-if="editableCpt"/>
      <a-tooltip title="预览">
        <a-button type="text" class="shadow-btn-wrapper" @click="handlePreivew">
          <eye-outlined />
        </a-button>
      </a-tooltip>
      <a-tooltip title="下载">
        <a-button type="text" class="shadow-btn-wrapper" @click="handleDownload">
          <download-outlined />
        </a-button>
      </a-tooltip>
    </a-space>
  </BubbleContainer>
</template>

<script setup lang="ts">
import { PropType, computed, inject, ref, Ref } from "vue";
import BubbleContainer from "../BubbleContainer.vue";
import { useAttributes } from "@speed-tiptap-editor/composables";
import {
  EyeOutlined,
  ProfileOutlined,
  CreditCardOutlined,
  DownloadOutlined,
} from "@ant-design/icons-vue";
import { type Editor } from "@tiptap/core";
import { useSpeedEditor } from '@speed-tiptap-editor/composables';
// 初始化注入的对象
const speedUseTiptapConfig = inject(
  "speedUseTiptapConfig",
  ref({})
) as Ref<any>;
// 顶层组件注入对象
const { speedTiptapConfig, editableCpt } = useSpeedEditor();

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
});
const attributes = useAttributes<{ fileId: string; displayMode: string }>(
  props.editor,
  'attachment',
  {
    fileId: "",
    displayMode: "title",
  }
);
const isActiveAttachment = computed(() => {
  return props?.editor.isActive('attachment') && !!attributes.value.fileId;
});

// 这里不限制气泡弹出（仅控制内部的菜单显示）
const shouldShow = () => {
  return (
    !props?.editor.view.state.selection.empty &&
    isActiveAttachment.value
  );
};

// 调用本地服务
const handlePreivew = () => {
  const getFilePreviewUrl = speedTiptapConfig?.value?.upload?.uploadApis?.getFilePreviewUrl
    || speedTiptapConfig?.value?.image?.uploadApis?.getFilePreviewUrl
    || speedUseTiptapConfig?.value?.apis?.getFilePreviewUrl;

  getFilePreviewUrl && window.open(getFilePreviewUrl(attributes.value.fileId));
};
const handleDownload = () => {
  props.editor
    ?.chain()
    .focus()
    .downloadAttachment(attributes.value.fileId)
    .run();
};
// 直接调用属性更新
const handleUpdateAttributes = (attrs: any) => {
  props.editor?.chain().focus().updateAttributes('attachment', attrs)
    .setNodeSelection(props.editor.state.selection.from).run();
};
</script>

<style scoped lang="less"></style>
