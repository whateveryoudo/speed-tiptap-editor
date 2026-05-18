<!--
 * @Author: ykx
 * @Date: 2022-11-15 16:17:06
 * @LastEditTime: 2022-11-30 19:56:33
 * @LastEditors: your name
 * @Description: 无序列表
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\bulletList.vue
-->
<template>
  <s-keymap-tip :keyMap="keyMap" :title="disableMenu ? null : '无序列表'">
    <a-button type="text" :class="['shadow-btn-wrapper', isBulletListActive ? 'is-active' : '']"
      @click="toggleBulletList" :disabled="disableMenu">
      <unordered-list-outlined />
    </a-button>
  </s-keymap-tip>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue'
import { Editor } from '@tiptap/core'
import { UnorderedListOutlined } from '@ant-design/icons-vue'
import { Title } from '@st/extensions/title'
import { useActive } from '@st/hooks/useActive'
import { BulletList as BulletListExtension } from '@st/extensions/bulletList';
import { getShortcutTipByKey } from '@st/helpers/registKeyMap'
import { useSpeedEditor } from '@st/hooks/useSpeedEditorContext';
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const isTitleActive = useActive(props.editor, Title.name)
const keyMap = getShortcutTipByKey('unorderedList')

const toggleBulletList = () => {
  if (isTitleActive.value) {
    return
  }
  props.editor && props.editor.chain().focus().toggleBulletList().run()
}
const { editableCpt } = useSpeedEditor();
const disableMenu = computed(() => {
  return isTitleActive.value || !editableCpt.value || !props.editor.isEditable
})
const isBulletListActive = useActive(props.editor, BulletListExtension.name)
</script>

<style scoped lang="less"></style>
