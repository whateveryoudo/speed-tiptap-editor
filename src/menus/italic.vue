<!--
 * @Author: ykx
 * @Date: 2022-11-16 19:16:43
 * @LastEditTime: 2022-11-24 12:00:15
 * @LastEditors: your name
 * @Description: 斜体
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\italic.vue
-->
<template>
  <a-tooltip title="斜体">
    <div
      :class="['shadow-bg-wrapper', isItalicActive ? 'is-active' : '', isTitleActive && 'disabled']"
      @click="toggleItalic"
    >
      <italic-outlined />
    </div>
  </a-tooltip>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Editor } from '@tiptap/core'
import { ItalicOutlined } from '@ant-design/icons-vue'
import { useActive } from '@/hooks/useActive'
import { Title } from '@/extensions/title'

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const isTitleActive = useActive(props.editor, Title.name)

const toggleItalic = () => {
  if (isTitleActive.value) {
    return
  }
  props.editor && props.editor.chain().focus().toggleItalic().run()
}
const isItalicActive = useActive(props.editor, 'italic')
</script>

<style scoped lang="less"></style>
