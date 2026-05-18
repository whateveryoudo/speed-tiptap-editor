<!--
 * @Author: ykx
 * @Date: 2022-11-16 19:16:43
 * @LastEditTime: 2022-11-24 12:00:15
 * @LastEditors: your name
 * @Description: 斜体
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\italic.vue
-->
<template>
  <s-keymap-tip :keyMap="keyMap" :title="editableCpt ? '斜体' : null">
    <a-button type="text" class="shadow-btn-wrapper"
      :class="[isItalicActive ? 'is-active' : '', isTitleActive && 'disabled']"
      v-on="buttonEvents"
      :disabled="!editableCpt || isTitleActive">
      <italic-outlined />
    </a-button>
  </s-keymap-tip>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core'
import { ItalicOutlined } from '@ant-design/icons-vue'
import { Title } from '@st/extensions/title'
import { useActive } from '@st/hooks/useActive'
import { useMenuButtonEvents } from '@st/hooks/useMenuButtonEvents'
import { getShortcutTipByKey } from '@st/helpers/registKeyMap'
import { useSpeedEditor } from '@st/hooks/useSpeedEditorContext';
const props = withDefaults(defineProps<{
  editor: Editor,
  triggerType?: 'menu' | 'bubble'
}>(), {
  editor: () => ({}) as Editor,
  triggerType: 'menu'
})
const keyMap = getShortcutTipByKey('italic');
const isTitleActive = useActive(props.editor, Title.name)
const { editableCpt } = useSpeedEditor();
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
