<!--
 * @Author: ykx
 * @Date: 2022-11-16 19:24:26
 * @LastEditTime: 2022-11-24 12:02:20
 * @LastEditors: your name
 * @Description: 删除线
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\strike.vue
-->
<template>
  <a-tooltip title="删除线">
    <div
      :class="['shadow-bg-wrapper', isStrikeActive ? 'is-active' : '', isTitleActive && 'disabled']"
      @click="toggleStrike"
    >
      <strikethrough-outlined />
    </div>
  </a-tooltip>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Editor } from '@tiptap/core'
import { StrikethroughOutlined } from '@ant-design/icons-vue'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const isTitleActive = useActive(props.editor, Title.name)
const toggleStrike = () => {
  if (isTitleActive.value) {
    return
  }
  props.editor && props.editor.chain().focus().toggleStrike().run()
}
const isStrikeActive = useActive(props.editor, 'strike')
</script>

<style scoped lang="less"></style>
