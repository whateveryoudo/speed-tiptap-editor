<!--
 * @Author: ykx
 * @Date: 2022-12-01 09:43:55
 * @LastEditTime: 2022-12-01 09:50:04
 * @LastEditors: your name
 * @Description: 任务列表
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\taskList.vue
-->

<template>
  <a-tooltip title="任务列表">
    <div
      :class="['shadow-bg-wrapper', isTaskListActive ? 'is-active' : '', isTitleActive && 'disabled']"
      @click="toggleTaskList"
    >
    <s-icon-font type="icon-kl-task"></s-icon-font>
    </div>
  </a-tooltip>
</template>
<script setup lang="ts">
import { PropType } from 'vue'
import { Editor } from '@tiptap/core'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
import { TaskList as TaskListExtension } from '@/extensions/taskList';

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const isTitleActive = useActive(props.editor, Title.name)
const toggleTaskList = () => {
  if (isTitleActive.value) {
    return
  }
  props.editor && props.editor.chain().focus().toggleTaskList().run()
}
const isTaskListActive = useActive(props.editor, TaskListExtension.name)
</script>

<style scoped lang="less"></style>
