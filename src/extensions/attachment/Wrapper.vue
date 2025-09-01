<!--
 * @Author: ykx
 * @Date: 2022-11-11 15:39:52
 * @LastEditTime: 2022-12-28 10:40:15
 * @LastEditors: your name
 * @Description: 附件容器
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\attachment\Wrapper.vue
-->
<template>
  <NodeViewWrapper class="inline-block">
    <div v-if="isEditable && !nodeAttrs.fileId" class="wrap">
      <a-spin :spinning="uploadLoading">
        <a-typography-text style="cursor: pointer">
          <a-progress
            v-if="showProgress"
            :percent="percent"
            showInfo
          ></a-progress>
          <span v-else>
            {{ uploadLoading ? "正在上传中" : "请选择文件" }}
          </span>
        </a-typography-text>
      </a-spin>
    </div>
    <file-display-bar
      v-if="nodeAttrs.fileId"
      v-bind="nodeAttrs"
      @download="handleDownloadFile"
    />
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { PropType, ref, computed, watch, inject, Ref } from "vue";
import { NodeViewWrapper } from "@tiptap/vue-3";
import { Editor } from "@tiptap/core";
import FileDisplayBar from "./FileDisplayBar.vue";
import { useCustomUpload, type IFileItem } from "speed-components-ui/hooks";

const props = defineProps({
  node: {
    type: Object,
    require: true,
    default: () => ({}),
  },
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
  updateAttributes: {
    type: Function,
    default: null,
  },
});

const isEditable = computed(() => {
  return props.editor?.isEditable;
});

const showProgress = ref(false);
const percent = ref(0);
// torefs无效？？
const nodeAttrs = computed(() => {
  return props.node?.attrs;
});

// 定义上传选项
const uploadOptions = ref({
  // 上传后的回调
  afterUpload: async (files: any[]) => {
    console.log("上传完成:", files);
    const file = files[0];

    props.updateAttributes &&
      props.updateAttributes({
        fileName: file.fileName,
        fileType: file.fileType,
        fileSize: file.fileSize,
        fileId: file.id,
      });
  },
});

// 使用自定义上传hook
const { customRequest, uploadLoading, handleDownloadFile } =
  useCustomUpload(uploadOptions);

// 处理文件选择
const startUpload = (file: File) => {
  // 如果后端支持多文件上传，则直接上传
  customRequest({
    file,
  });
};
watch(
  () => nodeAttrs.value.file,
  (file: File) => {
    if (file && !nodeAttrs.value.fileId) {
      startUpload(file);
    }
  },
  {
    immediate: true,
  }
);
defineExpose({
  handleDownloadFile,
});
</script>
<style lang="less" scoped>
.wrap {
  border: 1px solid var(--semi-color-border);
  border-radius: var(--border-radius);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  .sizeText {
    color: var(--semi-color-text-2);
  }
}
</style>
