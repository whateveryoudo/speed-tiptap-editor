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
import { PropType, computed, inject, ref, type Ref } from 'vue'
import { Editor } from '@tiptap/core'
import { UnorderedListOutlined } from '@ant-design/icons-vue'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
import { BulletList as BulletListExtension } from '@/extensions/bulletList';
import { getShortcutTipByKey } from '@/helpers/registKeyMap'
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
const editableCpt = inject('editableCpt', ref(true)) as Ref<boolean>
const disableMenu = computed(() => {
  return isTitleActive.value || !editableCpt.value || !props.editor.isEditable
})
const isBulletListActive = useActive(props.editor, BulletListExtension.name)
</script>

<style scoped lang="less"></style>
