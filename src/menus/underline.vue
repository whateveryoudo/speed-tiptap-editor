<!--
 * @Author: ykx
 * @Date: 2022-11-16 19:24:26
 * @LastEditTime: 2022-11-24 12:00:02
 * @LastEditors: your name
 * @Description: 下划线
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\underline.vue
-->
<template>
  <a-tooltip title="下划线">
    <div
      :class="[
        'shadow-bg-wrapper',
        isUnderlineActive ? 'is-active' : '',
        isTitleActive && 'disabled',
      ]"
      @click="toggleUnderline"
    >
      <underline-outlined />
    </div>
  </a-tooltip>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Editor } from '@tiptap/core'
import { UnderlineOutlined } from '@ant-design/icons-vue'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const isTitleActive = useActive(props.editor, Title.name)
const toggleUnderline = () => {
  if (isTitleActive.value) {
    return
  }
  props.editor && props.editor.chain().focus().toggleUnderline().run()
}
const isUnderlineActive = useActive(props.editor, 'underline')
</script>

<style scoped lang="less"></style>
