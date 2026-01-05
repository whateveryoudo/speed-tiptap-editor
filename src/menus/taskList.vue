<!--
 * @Author: ykx
 * @Date: 2022-12-01 09:43:55
 * @LastEditTime: 2022-12-01 09:50:04
 * @LastEditors: your name
 * @Description: 任务列表
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\taskList.vue
-->

<template>
  <s-keymap-tip :keyMap="keyMap" :title="disableMenu ? null : '任务列表'">
    <a-button
      type="text"
      class="shadow-btn-wrapper"
      :class="[isTaskListActive ? 'is-active' : '']"
      @click="toggleTaskList"
      :disabled="disableMenu"
    >
    <s-icon-font type="icon-kl-task"></s-icon-font>
    </a-button>
  </s-keymap-tip>
</template>
<script setup lang="ts">
import { PropType, computed } from 'vue'
import { Editor } from '@tiptap/core'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
import { TaskList as TaskListExtension } from '@/extensions/taskList';
import { getShortcutTipByKey } from '@/helpers/registKeyMap'
import { useSpeedEditor } from '@/hooks/useSpeedEditorContext';
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const isTitleActive = useActive(props.editor, Title.name)
const keyMap = getShortcutTipByKey('taskList')
const toggleTaskList = () => {
  if (isTitleActive.value) {
    return
  }
  props.editor && props.editor.chain().focus().toggleTaskList().run()
}
const { editableCpt } = useSpeedEditor();
const disableMenu = computed(() => {
  return isTitleActive.value || !editableCpt.value || !props.editor.isEditable
})
const isTaskListActive = useActive(props.editor, TaskListExtension.name)
</script>

<style scoped lang="less"></style>
