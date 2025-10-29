<!--
 * @Author: ykx
 * @Date: 2022-11-15 16:17:06
 * @LastEditTime: 2022-12-15 15:18:59
 * @LastEditors: your name
 * @Description: 图片插入
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\bold.vue
-->
<template>
  <a-tooltip :title="disableMenu ? null : '图片'">
    <a-button type="text" @click="handleClickImg" class="shadow-btn-wrapper"
      :class="[isImageActive ? 'is-active' : '', isTitleActive && 'disabled']" :disabled="disableMenu">
      <FileImageOutlined />
    </a-button>
    <input ref="ImageInput" @change="handleFileChange" :multiple="imageConfig?.multiple ?? true" type="file"
      :accept="imageConfig?.accept ?? '.svg,.png,.bmp,.jpg,.jpeg,.gif,.webp,.heic'" hidden />
  </a-tooltip>
</template>

<script setup lang="ts">
import { inject, ref, type Ref, computed } from 'vue'
import { Editor } from '@tiptap/core'
import { FileImageOutlined } from '@ant-design/icons-vue'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
import { useSpeedEditor } from '@/hooks/useSpeedEditorContext';
const props = withDefaults(defineProps<{
  editor: Editor,
  triggerType?: 'menu' | 'bubble'
}>(), {
  editor: () => ({}) as Editor,
  triggerType: 'menu'
})

const ImageInput = ref<HTMLInputElement>()
const { speedTiptapConfig, editableCpt } = useSpeedEditor();
const { image: imageConfig } = speedTiptapConfig.value;
const isTitleActive = useActive(props.editor, Title.name)
const disableMenu = computed(() => {
  return isTitleActive.value || !editableCpt.value
})
const isImageActive = useActive(props.editor, 'image')
const handleFileChange = (event: any) => {
  props.editor.chain().focus().uploadImage(event?.target?.files).run()
}
const handleClickImg = () => {
  ImageInput.value?.click()
}
</script>

<style scoped lang="less"></style>
