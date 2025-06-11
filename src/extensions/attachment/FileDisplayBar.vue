<!--
 * @Author: ykx
 * @Date: 2022-12-05 16:06:31
 * @LastEditTime: 2022-12-28 10:42:50
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\attachment\FileDisplayBar.vue
-->
<template>
  <div class="wrap">
    <a-space class="file-info">
      <s-icon-font v-if="fileTypeIcons[fileType]" :icon-render="fileTypeIcons[fileType]" />
      <a-typography-text
        >{{ fileName }}.{{ fileExt }}
        <a-typography-text style="margin-left: 5px" class="sizeText">
          ({{ fileSize }})
        </a-typography-text>
      </a-typography-text>
    </a-space>
    <a-space>
      <a-tooltip title="预览">
        <eye-outlined @click="handlePreview" />
      </a-tooltip>
      <a-tooltip title="下载">
        <download-outlined @click="handleDownLoad" />
      </a-tooltip>
    </a-space>
  </div>
</template>

<script setup lang="tsx">
import { message } from 'ant-design-vue'
import {
  AudioOutlined,
  FileOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  EyeOutlined,
  FilePdfOutlined,
} from '@ant-design/icons-vue'

const props = defineProps({
  fileType: {
    type: String,
    default: '',
  },
  fileName: {
    type: String,
  },
  fileExt: {
    type: String,
  },
  fileSize: {
    type: Number,
  },
  downLoadUrl: {
    type: String,
    default: '',
  },
  previewUrl: {
    type: String,
    default: '',
  },
})
const handlePreview = () => {
  props.previewUrl && window.open(props.previewUrl)
}
const fileTypeIcons = {
  audio: <AudioOutlined />,
  video: <VideoCameraOutlined />,
  file: <FileOutlined />,
  image: <FileImageOutlined />,
  pdf: <FilePdfOutlined />,
}
const handleDownLoad = () => {
  props.downLoadUrl && window.open(props.downLoadUrl)
}
</script>

<style scoped lang="less">
.wrap {
  border: 1px solid var(--semi-color-border);
  border-radius: var(--border-radius);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  .sizeText {
    font-size: 12px;
    color: var(--semi-color-text-2);
  }
}
</style>
