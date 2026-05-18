<!--
 * @Author: ykx
 * @Date: 2022-11-15 16:17:06
 * @LastEditTime: 2022-12-15 15:18:59
 * @LastEditors: your name
 * @Description: 查找和替换(非编辑态会禁用)
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\bold.vue
-->
<template>
  <s-keymap-tip :keyMap="keyMap" :title="editableCpt ? '查找替换' : null">
    <a-button type="text" class="shadow-btn-wrapper" :disabled="!editableCpt" v-on="buttonEvents">
      <FileSearchOutlined />
    </a-button>
  </s-keymap-tip>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core'
import { FileSearchOutlined } from '@ant-design/icons-vue'
import { useMenuButtonEvents } from '@st/hooks/useMenuButtonEvents'
import { useSpeedEditor } from '@st/hooks/useSpeedEditorContext';
import { getShortcutTipByKey } from '@st/helpers/registKeyMap';
const { editableCpt, searchReplaceVisible, updateSearchReplaceVisible } = useSpeedEditor();
const keyMap = getShortcutTipByKey('findAndReplace');
const props = withDefaults(defineProps<{
  editor: Editor,
  triggerType?: 'menu' | 'bubble'
}>(), {
  editor: () => ({}) as Editor,
  triggerType: 'menu'
})
const toggleSearchPanel = () => {
  updateSearchReplaceVisible(!searchReplaceVisible.value)
}
const buttonEvents = useMenuButtonEvents(toggleSearchPanel, props.triggerType)
</script>

<style scoped lang="less"></style>
