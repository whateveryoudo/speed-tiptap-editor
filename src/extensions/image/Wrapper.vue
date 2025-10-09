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
    <div v-if="!nodeAttrs.src" :class="['wrapper', uploadFailed ? 'upload-failed' : '']">
      <a-spin :spinning="uploadLoading">
        <img :class="uploadFailed ? 'upload-failed' : ''" :src="ImgPlaceholder" alt="请选择图片"
          style="width: 150px; height: auto">
      </a-spin>
    </div>
    <!-- <Resizeable v-else :editor="editor" class="render-wrapper" :isEditable="isEditable" :width="nodeAttrs.width || maxWidth"
      :height="nodeAttrs.height" :maxWidth="maxWidth" @changeEnd="updateImageAttrs">
      <img @click="handlePreivew" :src="nodeAttrs.src" :alt="nodeAttrs.alt" style="width: 100%; height: 100%" />
    </Resizeable> -->
    <drager v-else :selected="selected" :boundary="false" :disabled="!isEditable" :width="Number(node.attrs.width)"
      :height="Number(node.attrs.height)" :min-width="14" :min-height="14" :max-width="maxWidth" :max-height="maxWidth"
      @resize="onResize" @focus="selected = true">
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
import axios from 'axios'
import {
  getEditorContainerDOMSize,
  getImageWidthHeight,
} from '@/prose-utils'
import { useCustomUpload } from 'speed-components-ui/hooks'
import { message } from 'ant-design-vue';
// 初始化注入的对象
const speedUseTiptapConfig = inject(
  "speedUseTiptapConfig",
  ref({})
) as Ref<any>;
// 顶层组件注入对象
const speedTiptapConfig = inject("speedTiptapConfig", ref({})) as Ref<any>;
const previewInstance = inject('previewInstance') as Ref<any>
const uploadFailed = ref(false);
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
// 定义上传选项
const uploadOptions = computed(() => {
  const rawAccept =
    speedTiptapConfig?.value?.upload?.accept ||
    speedTiptapConfig?.value?.image?.accept ||
    speedUseTiptapConfig?.value?.image?.accept ||
    undefined
  // 兼容字符串或数组；其余情况返回空数组
  const acceptTypes = Array.isArray(rawAccept)
    ? rawAccept
    : typeof rawAccept === 'string'
      ? rawAccept.split(',')
      : []
  return {
    acceptTypes,
    maxSize: speedTiptapConfig?.value?.upload?.maxSize || speedTiptapConfig?.value?.image?.maxSize || speedUseTiptapConfig?.value?.image?.maxSize,
    // 传入ajax方法
    apis: {
      fileUploadMulti: speedTiptapConfig?.value?.upload?.uploadApis?.fileUploadMulti || speedTiptapConfig?.value?.image?.uploadApis?.fileUploadMulti || speedUseTiptapConfig?.value?.image?.uploadApis?.fileUploadMulti,
      fileUploadSingle: speedTiptapConfig?.value?.upload?.uploadApis?.fileUploadSingle || speedTiptapConfig?.value?.image?.uploadApis?.fileUploadSingle || speedUseTiptapConfig?.value?.image?.uploadApis?.fileUploadSingle,
      fileDel: speedTiptapConfig?.value?.upload?.uploadApis?.fileDel || speedTiptapConfig?.value?.image?.uploadApis?.fileDel || speedUseTiptapConfig?.value?.image?.uploadApis?.fileDel,
      fileDownload: speedTiptapConfig?.value?.upload?.uploadApis?.fileDownload || speedTiptapConfig?.value?.image?.uploadApis?.fileDownload || speedUseTiptapConfig?.value?.image?.uploadApis?.fileDownload,
    },
    // 上传后的回调
    afterUpload: async (files: any[], res: any) => {
      if (!res?.success) {
        message.error(res?.message);
        uploadFailed.value = true;
        return;
      }
      console.log("上传完成:", files);
      const file = files[0];
      // 兼容3种情况（顶层注入image、组件注入upload、组件注入apis）,优先级：顶层注入image > 组件注入upload > 组件注入apis
      const getPreviewUrl = speedTiptapConfig?.value?.upload?.uploadApis?.getPreviewUrl
        || speedTiptapConfig?.value?.image?.uploadApis?.getPreviewUrl
        || speedUseTiptapConfig?.value?.apis?.getPreviewUrl;

      const imgUrl = getPreviewUrl ? getPreviewUrl(file.id) : '';
      console.log('imgUrl', imgUrl);
      const size = await getImageWidthHeight(imgUrl)

      // 保存原始尺寸和当前尺寸
      props.updateAttributes && props.updateAttributes({
        ...size,
        src: imgUrl,
        originalWidth: size.width,  // 保存原始宽度
        originalHeight: size.height // 保存原始高度
      })
    },
    uploadError: (error: any) => {
      message.error(error.message);
      uploadFailed.value = true;
    }
  }
});

// 使用自定义上传hook
const { customRequest, beforeUpload: commonBeforeUpload, uploadLoading } =
  useCustomUpload(uploadOptions);
// 手动上传的beforeUpload(这里仅处理单个文件判断)
const manualBeforeUpload = (file: File | File[]) => {
  const beforeUpload = speedTiptapConfig?.value?.image?.beforeUpload || speedTiptapConfig?.value?.upload?.beforeUpload || speedUseTiptapConfig?.value?.image?.beforeUpload;
  const fileItem = Array.isArray(file) ? file[0] : file;
  if (beforeUpload) {
    return beforeUpload(fileItem)
  }
  // 通用拦截判断(调用hook)
  return commonBeforeUpload(fileItem as any);
}
// 处理文件选择
const startUpload = (file: File) => {
  // 这里直接用action判断
  const action = speedTiptapConfig?.value?.image?.action || speedTiptapConfig?.value?.upload?.action || speedUseTiptapConfig?.value?.apis?.fileUploadSingle;
  if (!action) {
    customRequest({
      file
    });
  } else { // 手动上传，需要用户传入一些信息（不建议使用此方案，大部分不建议直接配置url地址，而是传入方法）
    if (manualBeforeUpload(file)) {
      const headers = speedTiptapConfig?.value?.image?.headers || speedTiptapConfig?.value?.upload?.headers || speedUseTiptapConfig?.value?.apis?.headers;
      const data = speedTiptapConfig?.value?.image?.data || speedTiptapConfig?.value?.upload?.data || speedUseTiptapConfig?.value?.apis?.data;
      axios.post(action, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...headers
        },
        data: typeof data === 'function' ? data(file) : data
      }).then(async (res: any) => {
        if (!res?.success) {
          message.error(res?.message);
          uploadFailed.value = true;
          return;
        }
        const file = Array.isArray(res.data) ? res.data[0] : res.data;
        // 兼容3种情况（顶层注入image、组件注入upload、组件注入apis）,优先级：顶层注入image > 组件注入upload > 组件注入apis
        const getPreviewUrl = speedTiptapConfig?.value?.upload?.uploadApis?.getPreviewUrl
          || speedTiptapConfig?.value?.image?.uploadApis?.getPreviewUrl
          || speedUseTiptapConfig?.value?.apis?.getPreviewUrl;

        const imgUrl = getPreviewUrl ? getPreviewUrl(file.id) : '';
        console.log('imgUrl', imgUrl);
        const size = await getImageWidthHeight(imgUrl)
        // 保存原始尺寸和当前尺寸
        props.updateAttributes && props.updateAttributes({
          ...size,
          src: imgUrl,
          originalWidth: size.width,  // 保存原始宽度
          originalHeight: size.height // 保存原始高度
        })
      }).catch((err) => {
        console.log(err)
        message.error(err);
        uploadFailed.value = true;
      })
    }

  };
}
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
    padding-left: 6px;
    padding-right: 6px;
    cursor: pointer;
    justify-content: space-between;
    align-items: center;

    &.upload-failed {
      border-color: var(--ant-color-error);
    }
  }

  :deep(.es-drager) {
    position: relative;
  }
}
</style>
