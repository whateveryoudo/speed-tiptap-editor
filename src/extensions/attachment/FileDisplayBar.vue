<!--
 * @Author: ykx
 * @Date: 2022-12-05 16:06:31
 * @LastEditTime: 2022-12-28 10:42:50
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\attachment\FileDisplayBar.vue
-->
<template>
  <a-flex class="wrap max-w-[400px]" align="center" justify="space-between">
    <a-flex class="min-w-0 flex-1" align="center" gap="small">
      <s-icon-font
        v-if="fileTypeIcons[normalizeFileType(fileType) as keyof typeof fileTypeIcons]"
        :icon-render="fileTypeIcons[normalizeFileType(fileType) as keyof typeof fileTypeIcons].icon"
        :color="fileTypeIcons[normalizeFileType(fileType) as keyof typeof fileTypeIcons].color"
      />
      <span class="flex-1 flex gap-1 items-center min-w-0">
        <span class="truncate flex-1" :title="fileName" >{{ fileName }}</span>
        <span class="size-text">({{ normalizeFileSize(fileSize || 0) }})</span>
      </span>
    </a-flex>
    <a-space class="ml-2 flex-shrink-0">
      <a-tooltip title="预览">
        <eye-outlined @click="handlePreview" />
      </a-tooltip>
      <a-tooltip title="下载">
        <download-outlined @click="handleDownLoad" />
      </a-tooltip>
    </a-space>
  </a-flex>
</template>

<script setup lang="tsx">
import { inject, ref, Ref } from "vue";
import { normalizeFileType, normalizeFileSize } from "@/prose-utils/file";
import {
  AudioOutlined,
  FileOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  EyeOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FileZipOutlined,
  CodeOutlined,
} from "@ant-design/icons-vue";
import { type IFileItem } from "speed-components-ui/hooks";
import { message } from "ant-design-vue";
const speedTiptapConfig = inject("speed-tiptap-config", ref({})) as Ref<any>;
const props = withDefaults(
  defineProps<{
    fileType: string;
    fileName: string;
    fileSize: number;
    fileId: string;
  }>(),
  {
    fileType: "",
    fileName: "",
    fileSize: 0,
    fileId: "",
  }
);
const emit = defineEmits<{
  (e: "download", file: IFileItem): void;
}>();
const handlePreview = () => {
  message.info("功能待开发");
  // const getPreviewUrl = speedTiptapConfig?.value?.apis?.getPreviewUrl;

  // props.fileId && window.open(getPreviewUrl ? getPreviewUrl(props.fileId) : "");
};
const fileTypeIcons = {
  audio: { icon: <AudioOutlined />, color: '#48a25e' }  ,
  video: { icon: <VideoCameraOutlined />, color: '#48a25e' },
  file: { icon: <FileOutlined />, color: '#48a25e' },
  image: { icon: <FileImageOutlined />, color: '#48a25e' },
  pdf: { icon: <FilePdfOutlined />, color: '#48a25e' },
  document: { icon: <FileWordOutlined />, color: '#48a25e' },
  archive: { icon: <FileZipOutlined />, color: '#48a25e' },
  code: { icon: <CodeOutlined />, color: '#48a25e' },
};

const handleDownLoad = () => {
  props.fileId &&
    emit("download", {
      id: props.fileId,
      fileName: props.fileName,
      fileType: props.fileType,
      fileSize: props.fileSize,
    });
};
</script>

<style scoped lang="less">
.wrap {
  min-width: 200px;
  color: var(--ant-color-primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .size-text {
    font-size: 12px;
    color: var(--ant-color-text-2);
  }
  &.card {
    border: 1px solid var(--ant-color-border);
    border-radius: var(--ant-border-radius);
    padding: 8px 16px;
  }
}
</style>
