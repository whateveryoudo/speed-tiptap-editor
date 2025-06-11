<!--
 * @Author: ykx
 * @Date: 2022-11-15 16:17:06
 * @LastEditTime: 2022-11-30 19:56:33
 * @LastEditors: your name
 * @Description: 无序列表
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\bulletList.vue
-->
<template>
  <a-tooltip title="无序列表">
    <div
      :class="['shadow-bg-wrapper', isBulletListActive ? 'is-active' : '', isTitleActive && 'disabled']"
      @click="toggleBulletList"
    >
      <unordered-list-outlined />
    </div>
  </a-tooltip>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Editor } from '@tiptap/core'
import { UnorderedListOutlined } from '@ant-design/icons-vue'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
import { BulletList as BulletListExtension } from '@/extensions/bulletList';

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const isTitleActive = useActive(props.editor, Title.name)
const toggleBulletList = () => {
  if (isTitleActive.value) {
    return
  }
  props.editor && props.editor.chain().focus().toggleBulletList().run()
}
const isBulletListActive = useActive(props.editor, BulletListExtension.name)
</script>

<style scoped lang="less"></style>
