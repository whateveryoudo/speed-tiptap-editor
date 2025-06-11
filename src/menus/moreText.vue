<!--
 * @Author: ykx
 * @Date: 2022-11-10 19:15:40
 * @LastEditTime: 2022-12-07 11:19:20
 * @LastEditors: your name
 * @Description: 更多文字形式设置
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\moreText.vue
-->
<template>
  <a-popover
    v-if="!isTitleActive"
    overlay-class-name="text-popover-wrapper"
    trigger="click"
    placement="bottom">
    <template #content>
      <a-space>
        <ul class="text-list-wrapper">
          <li
            v-for="item in textItems"
            :key="item.key"
            :class="[
              'shadow-bg-wrapper',
              'list-item',
              selectItem && selectItem.key === item.key && 'is-active',
            ]"
            @click="item.action">
            <s-icon-font v-if="item.iconType" :size="item.size || 17" :type="item.iconType" />
            {{ item.name }}
          </li>
        </ul>
      </a-space>
    </template>
    <a-tooltip>
      <template #title> 更多文本样式 </template>
      <div class="shadow-bg-wrapper">
        <s-icon-font :size="17" type="icon-kl-text" style="margin-right: 3px" />
        <caret-down-outlined class="dropdown-trigger" />
      </div>
    </a-tooltip>
  </a-popover>
  <a-tooltip v-else class="menu-disabled">
    <template #title> 更多文本样式 </template>
    <div class="shadow-bg-wrapper">
      <s-icon-font :size="17" type="icon-kl-text" style="margin-right: 3px" />
      <caret-down-outlined class="dropdown-trigger" />
    </div>
  </a-tooltip>
</template>

<script setup lang="tsx">
import { Editor } from '@tiptap/core'
import { CaretDownOutlined } from '@ant-design/icons-vue'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
import { ref, type VNode, PropType, computed } from 'vue'
// import { Code as InlineCode } from '@/extensions/code'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
type TextType = 'sup' | 'sub' | 'code'

const isTitleActive = useActive(props.editor, Title.name)
const isSupActive = useActive(props.editor, Superscript.name)
const isSubActive = useActive(props.editor, Subscript.name)
const isCodeActive = useActive(props.editor, 'code')
const current = computed(() => {
  if (isSupActive.value) {
    return 'sup'
  } else if (isSubActive.value) {
    return 'sub'
  } else if (isCodeActive.value) {
    return 'code'
  } else {
    return ''
  }
})
interface TextItem {
  key: TextType
  name: string
  iconType?: string
  size?: number
  action?: (editor: Editor) => void
}
// 选中的项
const selectItem = computed(() => {
  return textItems.value.find((item: TextItem) => item.key === current.value) as TextItem
})

//追加互斥操作
const removeAllText = () => {
  props?.editor.chain().focus().unsetSuperscript().run()
  props?.editor.chain().focus().unsetSubscript().run()
  props?.editor.chain().focus().unsetCode().run()
}
const textItems = ref<TextItem[]>([
  {
    key: 'sup',
    name: '上标',
    iconType: 'icon-kl-superscript',
    action: () => {
      let tempActive = isSupActive.value;
      removeAllText();
      if (!tempActive) {
        props?.editor.chain().focus().setSuperscript().run()
      }
    },
  },
  {
    key: 'sub',
    name: '下标',
    iconType: 'icon-kl-subscript',
    action: () => {
      let tempActive = isSubActive.value;
      removeAllText();
      if (!tempActive) {
        props?.editor.chain().focus().setSubscript().run()
      }
    },
  },
  {
    key: 'code',
    name: '代码',
    iconType: 'icon-kl-code',
    size: 18,
    action: () => {
      let tempActive = isCodeActive.value;
      removeAllText();
      if (!tempActive) {
        props?.editor.chain().focus().setCode().run()
      }
    },
  },
])
</script>
<style lang="less">
.text-popover-wrapper {
  .ant-popover-inner {
    border-radius: 4px;
  }
  .ant-popover-inner-content {
    padding: 0;
  }
  .text-list-wrapper {
    padding: 4px 0;
    margin: 0;
    width: 120px;
    .list-item {
      padding: 0 10px;
      display: flex;
      align-items: center;
      height: 35px;
      justify-content: flex-start;
      & > span {
        margin-right: 5px;
        position: relative;
        top: 1px;
      }
    }
  }
}
</style>
