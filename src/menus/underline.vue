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
    <a-button
      type="text"
      class="shadow-btn-wrapper"
      :class="[isUnderlineActive ? 'is-active' : '', isTitleActive && 'disabled']"
      v-on="buttonEvents"
      :disabled="isTitleActive"
    >
      <underline-outlined />
    </a-button>
  </a-tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Editor } from '@tiptap/core'
import { UnderlineOutlined } from '@ant-design/icons-vue'
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
const toggleUnderline = () => {
  if (isTitleActive.value) {
    return
  }
  props.editor && props.editor.chain().focus().toggleUnderline().run()
}
const isUnderlineActive = useActive(props.editor, 'underline')
const buttonEvents = useMenuButtonEvents(toggleUnderline, props.triggerType)
</script>

<style scoped lang="less"></style>
