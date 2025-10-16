<!--
 * @Description: 插入表情
 * @Autor: ykx
 * @Date: 2022-12-02 09:58:37
 * @LastEditors: your name
 * @LastEditTime: 2023-01-04 15:48:55
-->
<template>
  <!-- 除了写两遍是否有其他方式？？ -->
  <a-tooltip v-if="!isTitleActive" title="插入表情">
    <emoji-picker @triggerEmoji="setEmoji">
      <a-button type="text" class="shadow-btn-wrapper">
        <s-icon-font type="icon-kl-emoji" :size="18" />
      </a-button>
    </emoji-picker>
  </a-tooltip>
  <a-tooltip v-else title="插入表情">
    <a-button type="text" class="shadow-btn-wrapper" disabled>
      <s-icon-font type="icon-kl-emoji" :size="18" />
    </a-button>
  </a-tooltip>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { Editor } from '@tiptap/core'
import EmojiPicker from '@/components/emojiPicker/index.vue'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
import { Emoji } from '@tiptap/extension-emoji'

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const isTitleActive = useActive(props.editor, Title.name)
const setEmoji = (emoji: string) => {
  const { selection } = props.editor.state
  const { $anchor } = selection
  return props.editor.chain().insertContentAt($anchor.pos, emoji).run()
}
const isEmojiActive = useActive(props.editor, Emoji.name)
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
