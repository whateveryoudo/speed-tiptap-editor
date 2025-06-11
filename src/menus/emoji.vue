<!--
 * @Description: 插入表情
 * @Autor: ykx
 * @Date: 2022-12-02 09:58:37
 * @LastEditors: your name
 * @LastEditTime: 2023-01-04 15:48:55
-->
<template>
  <a-tooltip title="插入表情">
    <emoji-picker @triggerEmoji="setEmoji">
      <span :class="['shadow-bg-wrapper', isTitleActive && 'disabled']">
        <s-icon-font type="icon-kl-emoji" :size="18" />
      </span>
    </emoji-picker>
  </a-tooltip>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Editor } from '@tiptap/core'
import EmojiPicker from '@/components/emojiPicker/index.vue'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const isTitleActive = useActive(props.editor, Title.name)
const setEmoji = (emoji: any) => {
  const { selection } = props.editor.state
  const { $anchor } = selection
  return props.editor.chain().insertContentAt($anchor.pos, emoji).run()
}
</script>

<style scoped lang="less">
.bg-color-menu-wrapper {
  display: flex;
  justify-items: center;

  .text-wrapper {
    display: flex;
    position: relative;

    .under-line {
      position: absolute;
      bottom: 0px;
      height: 2px;
      width: 80%;
      left: 10%;
    }
  }

  .dropdown-trigger {
    :deep(.anticon) {
      font-size: 10px;
      color: #666;
    }
  }
}
</style>
