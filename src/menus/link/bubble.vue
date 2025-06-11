<!--
 * @Author: ykx
 * @Date: 2022-11-16 18:21:23
 * @LastEditTime: 2023-01-09 16:23:18
 * @LastEditors: your name
 * @Description: 气泡工具（link气泡）
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\link\bubble.vue
-->
<template>
  <BaseBubbleMenu
    class="bubble-menu"
    :tippy-options="{ duration: 100 }"
    :editor="editor"
    :should-show="shouldShow"
    plugin-key="link-bubble-menu"
  >
    <a-space :size="5">
      <a-tooltip title="访问链接">
        <div
          :class="['shadow-bg-wrapper']"
          @click="visitLink"
        >
          <share-alt-outlined />
        </div>
      </a-tooltip>
      <a-tooltip title="编辑链接">
        <div
          :class="['shadow-bg-wrapper']"
          @click="openEditLinkModal"
        >
          <edit-outlined />
        </div>
      </a-tooltip>
      <a-tooltip title="去除链接">
        <div
          :class="['shadow-bg-wrapper']"
          @click="unsetLink"
        >
          <disconnect-outlined />
        </div>
      </a-tooltip>
    </a-space>
  </BaseBubbleMenu>
</template>

<script setup lang="ts">
import { PropType, watch, ref } from 'vue'
import { type Editor } from '@tiptap/core'
import { BubbleMenu as BaseBubbleMenu } from '@tiptap/vue-3'
import { Link } from '@/extensions/link'
import { findMarkPosition, isMarkActive } from '@/prose-utils'
import { LinkModalProps } from './modal'
import { ShareAltOutlined, DisconnectOutlined, EditOutlined } from '@ant-design/icons-vue'
import { useAttributes } from '@/hooks/useAttributes'
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const linkProp: LinkModalProps = {}
const emit = defineEmits(['triggerOpenModal'])
const linkAttrs = useAttributes(props.editor, Link.name, { href: '', target: '' }) as any
const shouldShow = () => {
  return !props?.editor.view.state.selection.empty && props?.editor.isActive(Link.name)
}
const visitLink = () => {
  window.open(linkAttrs.value?.href, linkAttrs.value?.target)
}
const unsetLink = () => {
  props.editor?.chain().extendMarkRange(Link.name).unsetLink().run()
}
const openEditLinkModal = () => {
  emit('triggerOpenModal', { ...linkProp, href: linkAttrs.value?.href })
}
watch(
  () => props.editor,
  (editor: Editor) => {
    const listener = () => {
      const isLinkActive = editor.isActive(Link.name)

      if (!isLinkActive) return

      const { state } = editor
      const isInLink = isMarkActive(state.schema.marks.link)(state)
      if (!isInLink) return

      const { $head, from, to } = editor.state.selection
      const marks = $head.marks()
      let start
      let end

      if (marks.length) {
        const mark = marks[0]
        const node = $head.node($head.depth)
        const startPosOfThisLine =
          $head.pos - (($head.nodeBefore && $head.nodeBefore.nodeSize) || 0)
        const endPosOfThisLine = $head.nodeAfter
          ? startPosOfThisLine + $head.nodeAfter.nodeSize
          : $head.pos - $head.parentOffset + node.content.size

        const { start: startPos, end: endPos } = findMarkPosition(
          state,
          mark,
          startPosOfThisLine,
          endPosOfThisLine,
        )
        start = startPos
        end = endPos
      } else {
        start = from
        end = to
      }

      const text = state.doc.textBetween(start, end)
      linkProp.text = text
      linkProp.from = start
      linkProp.to = end
    }

    editor.on('selectionUpdate', listener)
    return () => {
      editor.off('selectionUpdate', listener)
    }
  },
  { immediate: true },
)
</script>
<style scoped lang="less"></style>
