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
    <div
      :class="['shadow-bg-wrapper', isBoldActive ? 'is-active' : '', isTitleActive && 'disabled']"
      @click="toggleBold"
    >
      <bold-outlined />
    </div>
  </a-tooltip>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Editor } from '@tiptap/core'
import { BoldOutlined } from '@ant-design/icons-vue'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
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
