<!--
 * @Author: ykx
 * @Date: 2022-11-30 20:24:25
 * @LastEditTime: 2022-12-01 09:40:44
 * @LastEditors: your name
 * @Description: 有序列表
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\orderedList.vue
-->

<template>
  <a-tooltip title="有序列表">
    <a-button type="text" :class="['shadow-btn-wrapper', isOrderedListActive ? 'is-active' : '']"
      @click="toggleOrderedList" :disabled="isTitleActive">
      <ordered-list-outlined />
    </a-button>
  </a-tooltip>
</template>
<script setup lang="ts">
import { PropType } from 'vue'
import { Editor } from '@tiptap/core'
import { OrderedListOutlined } from '@ant-design/icons-vue'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
import { OrderedList as OrderedListExtension } from '@/extensions/orderedList';

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const isTitleActive = useActive(props.editor, Title.name)
const toggleOrderedList = () => {
  if (isTitleActive.value) {
    return
  }
  props.editor && props.editor.chain().focus().toggleOrderedList().run()
}
const isOrderedListActive = useActive(props.editor, OrderedListExtension.name)
</script>

<style scoped lang="less"></style>
