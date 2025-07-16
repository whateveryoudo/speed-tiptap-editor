<!--
 * @Author: ykx
 * @Date: 2022-11-16 18:21:23
 * @LastEditTime: 2023-01-09 16:23:18
 * @LastEditors: your name
 * @Description: 气泡工具（link气泡）
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\link\bubble.vue
-->
<template>
  <BaseBubbleMenu :editor="editor" :options="{
    placement: 'top',
    offset: 8,
    strategy: 'absolute',
  }" :should-show="shouldShow" plugin-key="link-bubble-menu">
    <div class="bubble-menu-wrapper">
      <a-space :size="5">
        <a-tooltip title="访问链接">
          <a-button type="text" class="shadow-btn-wrapper" @click="visitLink">
            <share-alt-outlined />
          </a-button>
        </a-tooltip>
        <a-tooltip title="编辑链接">
          <a-button type="text" class="shadow-btn-wrapper" @click="openEditLinkModal">
            <edit-outlined />
          </a-button>
        </a-tooltip>
        <a-tooltip title="去除链接">
          <a-button type="text" class="shadow-btn-wrapper" @click="unsetLink">
            <disconnect-outlined />
          </a-button>
        </a-tooltip>
      </a-space>
    </div>
  </BaseBubbleMenu>
</template>

<script setup lang="ts">
import { PropType, watch, onMounted } from 'vue'
import { type Editor } from '@tiptap/core'
import { BubbleMenu as BaseBubbleMenu } from '@tiptap/vue-3/menus'
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

const shouldShow = ({ editor, state }: { editor: any; state: any }) => {
  return !state.selection.empty && editor.isActive(Link.name)
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

onMounted(() => {
  // 确保样式正确应用
  const style = document.createElement('style')
  style.textContent = `
    .bubble-menu {
      background: white !important;
      border: 1px solid #d9d9d9 !important;
      border-radius: 6px !important;
      padding: 4px !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
      z-index: 1000 !important;
      pointer-events: auto !important;
      user-select: none !important;
    }
  `
  document.head.appendChild(style)
})

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

<style scoped lang="less">

</style>
