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
    <a-button type="text" class="shadow-btn-wrapper"
      :class="[isItalicActive ? 'is-active' : '', isTitleActive && 'disabled']"
      v-on="buttonEvents"
      :disabled="isTitleActive">
      <italic-outlined />
    </a-button>
  </a-tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Editor } from '@tiptap/core'
import { ItalicOutlined } from '@ant-design/icons-vue'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
import { useMenuButtonEvents } from '@/hooks/useMenuButtonEvents'

const props = withDefaults(defineProps<{
  editor: Editor,
  triggerType?: 'menu' | 'bubble'
}>(), {
  editor: () => ({}) as Editor,
  triggerType: 'menu'
})
const isTitleActive = useActive(props.editor, Title.name)
const toggleItalic = () => {
  if (isTitleActive.value) {
    return
  }
  props.editor && props.editor.chain().focus().toggleItalic().run()
}
const isItalicActive = useActive(props.editor, 'italic')
const buttonEvents = useMenuButtonEvents(toggleItalic, props.triggerType)
</script>

<style scoped lang="less"></style>
