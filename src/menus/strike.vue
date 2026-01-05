<!--
 * @Author: ykx
 * @Date: 2022-11-16 19:24:26
 * @LastEditTime: 2022-11-24 12:02:20
 * @LastEditors: your name
 * @Description: 删除线
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\strike.vue
-->
<template>
  <s-keymap-tip :keyMap="keyMap" :title="editableCpt ? '删除线' : null">
    <a-button type="text" class="shadow-btn-wrapper"
      :class="[isStrikeActive ? 'is-active' : '', isTitleActive && 'disabled']"
      v-on="buttonEvents"
      :disabled="!editableCpt || isTitleActive">
      <strikethrough-outlined />
    </a-button>
  </s-keymap-tip>
</template>

<script setup lang="ts">
import { type Editor } from '@tiptap/core'
import { StrikethroughOutlined } from '@ant-design/icons-vue'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
import { useMenuButtonEvents } from '@/hooks/useMenuButtonEvents'
import { getShortcutTipByKey } from '@/helpers/registKeyMap'
import { useSpeedEditor } from '@/hooks/useSpeedEditorContext';
const props = withDefaults(defineProps<{
  editor: Editor,
  triggerType?: 'menu' | 'bubble'
}>(), {
  editor: () => ({}) as Editor,
  triggerType: 'menu'
})
const keyMap = getShortcutTipByKey('strike');

const { editableCpt } = useSpeedEditor();
const isTitleActive = useActive(props.editor, Title.name)
const toggleStrike = () => {
  if (isTitleActive.value) {
    return
  }
  props.editor && props.editor.chain().focus().toggleStrike().run()
}
const isStrikeActive = useActive(props.editor, 'strike')
const buttonEvents = useMenuButtonEvents(toggleStrike, props.triggerType)
</script>

<style scoped lang="less"></style>
