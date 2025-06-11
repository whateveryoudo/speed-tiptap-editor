<!--
 * @Author: ykx
 * @Date: 2022-11-16 19:24:26
 * @LastEditTime: 2023-01-09 16:14:27
 * @LastEditors: your name
 * @Description: 插入链接
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\link\index.vue
-->
<template>
  <a-tooltip title="插入链接">
    <div
      :class="['shadow-bg-wrapper', isLinkActive ? 'is-active' : '', isTitleActive && 'disabled']"
      @click="createOrToggleLink"
    >
      <link-outlined />
    </div>
  </a-tooltip>
  <!-- bubble气泡 -->
  <link-bubble
    v-if="!isEmpty(editor)"
    :editor="editor"
    @triggerOpenModal="handleEditLink"
  />
  <!-- modal设置 -->
  <!-- <link-modal-setting
    v-bind="linkModalProp"
    :editor="editor"
    @closeModal="linkModalProp.visible = false"
  /> -->
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue'
import { Editor } from '@tiptap/core'
import { LinkOutlined } from '@ant-design/icons-vue'
import { isMarkActive } from '@/prose-utils'
// import LinkModalSetting from './modal.vue'
import LinkBubble from './bubble.vue'
import { LinkModalProps } from './modal'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
import { isEmpty } from 'lodash-es'
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const linkModalProp = ref<LinkModalProps>({})
const isTitleActive = useActive(props.editor, Title.name)
const isLinkActive = useActive(props.editor, 'Link')

const createOrToggleLink = () => {
  if (isTitleActive.value) {
    return
  }
  if (props.editor && props.editor.state) {
    const state = props.editor.state
    const isInLink = isMarkActive(state.schema.marks.link)(state)
    if (!isInLink) {
      const selection = state.selection
      const text = state.doc.textBetween(selection.from, selection.to)
      linkModalProp.value.text = text
      linkModalProp.value.from = selection.from
      linkModalProp.value.to = selection.to
      linkModalProp.value.visible = true
    } else {
      props.editor.chain().focus().unsetLink().run()
    }
  }
}
// 编辑选中link
const handleEditLink = (data: LinkModalProps) => {
  console.log(data);
  linkModalProp.value = { ...linkModalProp.value, visible: true, ...data }
}
</script>

<style scoped lang="less"></style>
