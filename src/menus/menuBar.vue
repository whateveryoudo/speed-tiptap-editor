<!--
 * @Author: ykx
 * @Date: 2022-11-10 18:46:09
 * @LastEditTime: 2022-12-28 16:13:16
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\editor\collaboration\menuBar.vue
-->
<template>
  <header class="menu-header-wrapper">
    <a-space :size="5" wrap>
      <InsertPopover :editor="editor" />
      <a-divider type="vertical" />
      <Undo :editor="editor" />
      <Redo :editor="editor" />
      <ClearNodeAndMarks :editor="editor" />

      <a-divider type="vertical" />
      <Heading :editor="editor" />
      <FontSize :editor="editor" />
      <Bold :editor="editor" />
      <Italic :editor="editor" />
      <Underline :editor="editor" />
      <Strike :editor="editor" />
      <MoreText :editor="editor" />
      <TextColor :editor="editor" />
      <BackgroundColor :editor="editor" />
      <a-divider type="vertical" />
      <Link :editor="editor" />
      <a-divider type="vertical" />

      <Align :editor="editor" />
      <a-divider type="vertical" />
      <BulletList :editor="editor"/>
      <OrderedList :editor="editor"/>
      <TaskList :editor="editor"/>
      <a-divider type="vertical" />
      <Emoji :editor="editor"/>
      <BlockQuote :editor="editor"/>
      <HorizontalRule :editor="editor"/>
      <!-- 
      <Emoji :editor="editor" />
      <Blockquote :editor="editor" />
       -->
    </a-space>
  </header>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core'
import { PropType } from 'vue'
import InsertPopover from './insert/popover.vue'
import Undo from './undo.vue'
import Redo from './redo.vue'
import ClearNodeAndMarks from './clearNodeAndMarks.vue'
import Bold from './bold.vue'
import Italic from './italic.vue'
import Underline from './underline.vue'
import Strike from './strike.vue'
import Link from './link/index.vue'
import Heading from './heading.vue'
import FontSize from './fontSize.vue'
import TextColor from './textColor.vue'
import BackgroundColor from './backgroundColor.vue'
import Align from './align.vue'
import MoreText from './moreText.vue'
import BulletList from './bulletList.vue'
import OrderedList from './orderedList.vue'
import TaskList from './taskList.vue'
import BlockQuote from './blockQuote.vue'
import HorizontalRule from './horizontalRule.vue'
import Emoji from './emoji.vue'
defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
</script>

<style scoped lang="less">
.menu-header-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid var(--ant-border-color);
  border-top: 1px solid var(--ant-border-color);
  background: #fff;
  padding: 0 30px;
  :deep(.ant-divider) {
    color: #585a5a;
    margin: 0;
    height: 1.2em;
  }
}
</style>
