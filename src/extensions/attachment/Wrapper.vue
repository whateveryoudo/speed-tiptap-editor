<!--
 * @Author: ykx
 * @Date: 2022-11-11 15:39:52
 * @LastEditTime: 2022-12-28 10:40:15
 * @LastEditors: your name
 * @Description: 附件容器
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\attachment\Wrapper.vue
-->
<template>
  <NodeViewWrapper :style="{ textAlign: nodeAttrs.textAlign, maxWidth: '100%' }">
    <div v-if="nodeAttrs.error" class="wrap">
      <a-typography-text>{{ nodeAttrs.error }}</a-typography-text>
    </div>
    <div v-if="isEditable && !nodeAttrs.downLoadUrl" class="wrap" @click="selectFile">
      <a-spin :spinning="loading">
        <a-typography-text style="cursor: pointer">
          <a-progress v-if="showProgress" :percent="percent" showInfo></a-progress>
          <span v-else>
            {{ loading ? '正在上传中' : '请选择文件' }}
          </span>
        </a-typography-text>
        <input ref="uploadRef" type="file" hidden @change="handleFile" />
      </a-spin>
    </div>
    <file-display-bar v-if="nodeAttrs.downLoadUrl" v-bind="fileInfo" />
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { PropType, ref, computed, watchEffect, toRefs } from 'vue'
import { NodeViewWrapper } from '@tiptap/vue-3'
import { Editor } from '@tiptap/core'
import { uploadFile } from '@/services/file'
import { FILE_CHUNK_SIZE } from '@/services/file'
import FileDisplayBar from './FileDisplayBar.vue'
import {
  extractFileExtension,
  extractFilename,
  getEditorContainerDOMSize,
  getImageWidthHeight,
  normalizeFileSize,
  normalizeFileType,
} from '@/prose-utils'

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
})

const isEditable = computed(() => {
  return props.editor?.isEditable
})

const showProgress = ref(false)
const percent = ref(0)
// torefs无效？？
const nodeAttrs = computed(() => {
  return props.node?.attrs
})
console.log(nodeAttrs.value)
const fileInfo = ref({
  fileName: nodeAttrs.value?.fileName,
  fileSize: nodeAttrs.value?.fileSize,
  fileType: nodeAttrs.value?.fileType,
  fileExt: nodeAttrs.value?.fileExt,
  downLoadUrl: nodeAttrs.value?.downLoadUrl,
  previewUrl: nodeAttrs.value?.previewUrl,
})
const uploadRef = ref<HTMLInputElement>()
const loading = ref(false)
const selectFile = () => {
  if (
    !isEditable.value ||
    nodeAttrs.value.error ||
    nodeAttrs.value.downLoadUrl ||
    nodeAttrs.value.previewUrl
  ) {
    return
  }
  console.log(uploadRef)
  uploadRef.value && uploadRef.value.click()
}
const handleFile = async (e: any) => {
  const file = e.target.files && e.target.files[0]
  fileInfo.value = {
    fileName: extractFilename(file.name),
    fileSize: normalizeFileSize(file.size),
    fileType: normalizeFileType(file.type),
    fileExt: extractFileExtension(file.name),
    downLoadUrl: '',
    previewUrl: '',
  }
  loading.value = true
  if (file.size > FILE_CHUNK_SIZE) {
    showProgress.value = true
  }
  try {
    const result = await uploadFile(file, val => {
      percent.value = val
    })
    const url = result?.data
      ? import.meta.env.VITE_APP_BASE_URL + '/file/download/' + result?.data
      : ''
    const url1 = result?.data
      ? import.meta.env.VITE_APP_BASE_URL + '/file/preView/' + result?.data
      : ''
    fileInfo.value.downLoadUrl = url
    fileInfo.value.previewUrl = url1
    props.updateAttributes && props.updateAttributes({ ...fileInfo.value })
    loading.value = false
    showProgress.value = false
  } catch (error: any) {
    props.updateAttributes &&
      props.updateAttributes({ error: '文件上传失败：' + (error && error.message) || '未知错误' })
    loading.value = false
  }
}
watchEffect(
  () => {
    if (
      !nodeAttrs.value.downLoadUrl &&
      !nodeAttrs.value.previewUrl &&
      !nodeAttrs.value.hasTrigger
    ) {
      selectFile()
      props.updateAttributes && props.updateAttributes({ hasTrigger: true })
    }
  },
  { flush: 'post' },
)
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
