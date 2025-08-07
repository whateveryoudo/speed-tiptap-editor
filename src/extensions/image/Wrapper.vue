<!--
 * @Author: ykx
 * @Date: 2022-11-11 15:39:52
 * @LastEditTime: 2022-12-21 12:20:20
 * @LastEditors: Please set LastEditors
 * @Description: 图片容器(无法删除图片最左边的最后一个文字？？)
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\image\Wrapper.vue
-->
<template>
  <NodeViewWrapper class="node-image">
    <!-- <div v-if="nodeAttrs.error" :class="styles.wrapper">
      <a-typography-text>{{ nodeAttrs.error }}</a-typography-text>
    </div> -->
    <div v-if="!nodeAttrs.src" class="wrapper">
      <a-spin :spinning="uploadLoading">
        <img :src="ImgPlaceholder" alt="请选择图片" style="width: 100%; height: 100%">
      </a-spin>
    </div>
    <!-- <Resizeable v-else :editor="editor" class="render-wrapper" :isEditable="isEditable" :width="nodeAttrs.width || maxWidth"
      :height="nodeAttrs.height" :maxWidth="maxWidth" @changeEnd="updateImageAttrs">
      <img @click="handlePreivew" :src="nodeAttrs.src" :alt="nodeAttrs.alt" style="width: 100%; height: 100%" />
    </Resizeable> -->
    <drager v-else :selected="selected" :draggable="false" :boundary="false" :disabled="!isEditable"
      :width="Number(node.attrs.width)" :height="Number(node.attrs.height)" :min-width="14" :min-height="14"
      :max-width="maxWidth" :max-height="maxWidth" @resize="onResize" @focus="selected = true">
      <img @click="handlePreivew" :src="nodeAttrs.src" :alt="nodeAttrs.alt" style="width: 100%; height: 100%" />
    </drager>

  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { PropType, inject, ref, computed, watch, Ref } from 'vue'
import { NodeViewWrapper } from '@tiptap/vue-3'
import { Editor } from '@tiptap/core'
import Drager from 'es-drager'
import ImgPlaceholder from '@/assets/image/img-placeholder.png'
import {
  getEditorContainerDOMSize,
  getImageWidthHeight,
} from '@/prose-utils'
import { useCustomUpload } from 'speed-components-ui/hooks'
const speedTiptapConfig = inject(
  "speed-tiptap-config",
  ref({})
) as Ref<any>;
const previewInstance = inject('previewInstance') as Ref<any>
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
const selected = ref(false)
const isEditable = computed(() => {
  return props.editor?.isEditable
})
// torefs无效？？
const nodeAttrs = computed(() => {
  return props.node?.attrs
})
const uploadRef = ref<HTMLInputElement>()
// 定义上传选项
const uploadOptions = ref({
  // 上传后的回调
  afterUpload: async (files: any[]) => {
    console.log("上传完成:", files);
    const file = files[0];
    const getPreviewUrl = speedTiptapConfig?.value?.apis?.getPreviewUrl;

    const imgUrl = getPreviewUrl ? getPreviewUrl(file.id) : '';
    const size = await getImageWidthHeight(imgUrl)

    props.updateAttributes && props.updateAttributes({ ...size, src: imgUrl })

  },
});

// 使用自定义上传hook
const { customRequest, handleDelFile, uploadLoading, files } =
  useCustomUpload(uploadOptions);

// 处理文件选择
const startUpload = (file: File) => {
  // 如果后端支持多文件上传，则直接上传
  customRequest({
    file
  });
};
// const { error, src, alt, textAlign, width, height } = toRefs(props.node.attrs)
const maxWidth = getEditorContainerDOMSize(props.editor)?.width
// const selectFile = () => {
//   if (!isEditable.value || nodeAttrs.value.error || nodeAttrs.value.src) {
//     return
//   }
//   console.log(uploadRef)
//   uploadRef.value && uploadRef.value.click()
// }
const onResize = ({ width, height }: { width: number; height: number }) => {
  props.updateAttributes({
    width: width.toFixed(2),
    height: height.toFixed(2),
  })
}
const onRotate = (angle: any) => {
  props.updateAttributes({ angle });
}
const updateImageAttrs = (size: any) => {
  props.updateAttributes({ height: size.height, width: size.width });
}

// const handleFile = async (e: any) => {
//   const file = e.target.files && e.target.files[0]

//   const fileInfo = {
//     fileName: extractFilename(file.name),
//     fileSize: file.size,
//     fileType: file.type,
//     fileExt: extractFileExtension(file.name),
//   }

//   loading.value = true

//   try {
//     const result = await uploadFile(file)

//     const imgUrl = result?.data
//       ? import.meta.env.VITE_APP_BASE_URL + '/file/picture/' + result?.data
//       : ''
//     const size = await getImageWidthHeight(imgUrl)

//     props.updateAttributes && props.updateAttributes({ ...fileInfo, ...size, src: imgUrl })
//     loading.value = false
//   } catch (error: any) {
//     props.updateAttributes &&
//       props.updateAttributes({ error: '图片上传失败：' + (error && error.message) || '未知错误' })
//     loading.value = false
//   }
// }
const handlePreivew = () => {
  if (!isEditable.value) {
    // 调用全局图片预览
    if (previewInstance.value) {
      previewInstance.value.previewImage(nodeAttrs.value?.src)
    }
  }
}
// watchEffect(
//   () => {
//     if (!nodeAttrs.value.src && !nodeAttrs.value.hasTrigger) {
//       selectFile()
//       props.updateAttributes && props.updateAttributes({ hasTrigger: true })
//     }
//   },
//   { flush: 'post' },
// )
watch(() => nodeAttrs.value.file, (file: File) => {
  if (file && !nodeAttrs.value.src) {
    startUpload(file)
  }
}, {
  immediate: true
})

</script>

<style lang="less" scoped>
.node-image {
  display: inline-block;
  position: relative;

  .wrapper {
    display: flex;
    padding: 8px 16px;
    cursor: pointer;
    border: 1px solid var(--ant-color-border);
    border-radius: var(--ant-border-radius);
    justify-content: space-between;
    align-items: center;
  }

  :deep(.es-drager) {
    position: relative;
  }
}
</style>
