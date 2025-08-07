<!--
 * @Author: ykx
 * @Date: 2022-11-16 18:21:23
 * @LastEditTime: 2023-01-09 11:12:21
 * @LastEditors: your name
 * @Description: 气泡工具-图片 & 附件
 * @FilePath: \we-knowledge-base\src\tiptap\editor\collaboration\bubbleMenus\ImageMenu\index.vue
-->
<template>
  <BubbleContainer class="bubble-menu" :editor="editor" plugin-key="image-bubble-menu" :should-show="shouldShow">
    <a-space :size="5">
      <a-tooltip title="复制">
        <div :class="['shadow-bg-wrapper']" @click="handleCopyNode(activeBlockName)">
          <copy-outlined />
        </div>
      </a-tooltip>
      <a-tooltip title="删除">
        <div :class="['shadow-bg-wrapper']" @click="handleDelNode(activeBlockName)">
          <delete-outlined />
        </div>
      </a-tooltip>
      <!-- 直接调用通用的居中配置 -->
      <align v-if="isActiveImage" :editor="editor"></align>
      <a-tooltip v-if="isActiveImage" title="预览">
        <div :class="['shadow-bg-wrapper']" @click="handlePreivew">
          <eye-outlined />
        </div>
      </a-tooltip>
    </a-space>
  </BubbleContainer>
</template>

<script setup lang="ts">
import { inject, PropType, computed, Ref } from 'vue'
import BubbleContainer from '../BubbleContainer.vue'
import { Image } from '@/extensions/image'
import { Attachment } from '@/extensions/attachment'
import align from '@/menus/align.vue'
import { useBubble } from '@/hooks/useBubble'
import { useAttributes } from '@/hooks/useAttributes'
import { DeleteOutlined, EyeOutlined, CopyOutlined } from '@ant-design/icons-vue'
import { type Editor } from '@tiptap/core'
// type AlignType = 'left' | 'center' | 'right'
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const isActiveImage = computed(() => {
  return props?.editor.isActive(Image.name) && !!props?.editor.getAttributes(Image.name).src
})

const isActiveAttachment = computed(() => {
  return (
    props?.editor.isActive(Attachment.name) &&
    !!props?.editor.getAttributes(Attachment.name).downLoadUrl
  )
})

const activeBlockName = computed(() => {
  return isActiveImage.value ? Image.name : Attachment.name
})
const { handleDelNode, handleCopyNode } = useBubble(props?.editor, {})
const shouldShow = () => {
  return (
    props?.editor?.isEditable &&
    !props?.editor.view.state.selection.empty &&
    (isActiveImage.value || isActiveAttachment.value)
  )
}
// const alignKey = ref<AlignType>('left')
// const setAlign = (align: AlignType) => {
//   props.editor
//     .chain()
//     .updateAttributes(activeBlockName.value, {
//       textAlign: align,
//     })
//     .setNodeSelection(props.editor.state.selection.from)
//     .focus()
//     .run()
//   alignKey.value = align
// }
// 图片专有
const src = useAttributes(props.editor, Image.name, { src: '' }, attrs => attrs.src)
const previewInstance = inject('previewInstance') as Ref<any>
const handlePreivew = () => {
  if (previewInstance.value) {  
    previewInstance.value.previewImage(src.value)
  }
}
</script>

<style scoped lang="less"></style>
