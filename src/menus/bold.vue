<!--
 * @Author: ykx
 * @Date: 2022-11-15 16:17:06
 * @LastEditTime: 2022-12-15 15:18:59
 * @LastEditors: your name
 * @Description: 粗体
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\bold.vue
-->
<template>
  <a-tooltip title="粗体">
    <a-button type="text" class="shadow-btn-wrapper"
      :class="[isBoldActive ? 'is-active' : '', isTitleActive && 'disabled']" @click="toggleBold"
      :disabled="isTitleActive">
      <bold-outlined />
    </a-button>
  </a-tooltip>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core'
import { BoldOutlined } from '@ant-design/icons-vue'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'

const props = withDefaults(defineProps<{
  editor: Editor,
}>(), {
  editor: () => ({}) as Editor,
})
const isTitleActive = useActive(props.editor, Title.name)
const toggleBold = () => {
  if (isTitleActive.value) {
    return
  }
  props.editor && props.editor.chain().focus().toggleBold().run()
}
const isBoldActive = useActive(props.editor, 'bold')
</script>

<style scoped lang="less"></style>
