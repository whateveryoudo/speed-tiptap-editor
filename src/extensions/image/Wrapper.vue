<!--
 * @Author: ykx
 * @Date: 2022-11-11 15:39:52
 * @LastEditTime: 2022-12-21 12:20:20
 * @LastEditors: Please set LastEditors
 * @Description: 图片容器
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\image\Wrapper.vue
-->
<template>
  <NodeViewWrapper class="node-image" :style="{ textAlign: nodeAttrs.textAlign, maxWidth: '100%' }">
    <div v-if="nodeAttrs.error" :class="styles.wrap">
      <a-typography-text>{{ nodeAttrs.error }}</a-typography-text>
    </div>
    <div v-else-if="!nodeAttrs.src" :class="styles.wrap" @click="selectFile">
      <a-spin :spinning="loading">
        <a-typography-text style="cursor: pointer">
          {{ loading ? '正在上传中' : '请选择图片' }}
        </a-typography-text>
        <input ref="uploadRef" accept="image/*" type="file" hidden @change="handleFile" />
      </a-spin>
    </div>
    <s-resizeable
      v-else
      class="render-wrapper"
      :isEditable="isEditable"
      :width="nodeAttrs.width || maxWidth"
      :height="nodeAttrs.height"
      :maxWidth="maxWidth"
      @changeEnd="updateImageAttrs">
      <img
        @click="handlePreivew"
        :src="nodeAttrs.src"
        :alt="nodeAttrs.alt"
        style="width: 100%; height: 100%" />
    </s-resizeable>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { PropType,inject, ref, computed, watchEffect, toRefs } from 'vue'
import { NodeViewWrapper } from '@tiptap/vue-3'
import { Editor } from '@tiptap/core'
import { uploadFile } from '@/services/file'
import styles from './index.module.less'
import {
  extractFileExtension,
  extractFilename,
  getEditorContainerDOMSize,
  getImageWidthHeight,
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
// torefs无效？？
const nodeAttrs = computed(() => {
  return props.node?.attrs
})
const uploadRef = ref<HTMLInputElement>()
const loading = ref(false)
// const { error, src, alt, textAlign, width, height } = toRefs(props.node.attrs)
const maxWidth = getEditorContainerDOMSize(props.editor)?.width
const selectFile = () => {
  if (!isEditable.value || nodeAttrs.value.error || nodeAttrs.value.src) {
    return
  }
  console.log(uploadRef)
  uploadRef.value && uploadRef.value.click()
}
const updateImageAttrs = (size: any) => {
  props.updateAttributes({ height: size.height, width: size.width })
}
const handleFile = async (e: any) => {
  const file = e.target.files && e.target.files[0]

  const fileInfo = {
    fileName: extractFilename(file.name),
    fileSize: file.size,
    fileType: file.type,
    fileExt: extractFileExtension(file.name),
  }

  loading.value = true

  try {
    const result = await uploadFile(file)

    const imgUrl = result?.data
      ? import.meta.env.VITE_APP_BASE_URL + '/file/picture/' + result?.data
      : ''
    const size = await getImageWidthHeight(imgUrl)

    props.updateAttributes && props.updateAttributes({ ...fileInfo, ...size, src: imgUrl })
    loading.value = false
  } catch (error: any) {
    props.updateAttributes &&
      props.updateAttributes({ error: '图片上传失败：' + (error && error.message) || '未知错误' })
    loading.value = false
  }
}
const $viewerApi = inject('$viewerApi') as any
const handlePreivew = () => {
  if (!isEditable.value) {
    $viewerApi({
      images: [nodeAttrs.value?.src],
    })
  }
}
watchEffect(
  () => {
    if (!nodeAttrs.value.src && !nodeAttrs.value.hasTrigger) {
      selectFile()
      props.updateAttributes && props.updateAttributes({ hasTrigger: true })
    }
  },
  { flush: 'post' },
)
</script>
