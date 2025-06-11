<!--
 * @Author: ykx
 * @Date: 2022-11-10 19:15:40
 * @LastEditTime: 2022-11-25 11:04:52
 * @LastEditors: your name
 * @Description: 对齐设置
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\align.vue
-->
<template>
  <a-popover
    v-if="!isTitleActive"
    overlay-class-name="align-popover-wrapper"
    trigger="click"
    placement="bottom"
  >
    <template #content>
      <a-space class="align-list-wrapper">
        <a-tooltip
          v-for="item in alignButtons"
          :key="item.key"
        >
          <template #title>
            {{ item.tip }}
          </template>
          <div
            :class="['shadow-bg-wrapper', selectButton.key === item.key && 'is-active']"
            @click="item.action"
          >
            <s-icon-font
              v-if="item.iconRender"
              :icon-render="item.iconRender"
            />
          </div>
        </a-tooltip>
      </a-space>
    </template>
    <a-tooltip>
      <template #title>
        对齐方式
      </template>
      <div class="shadow-bg-wrapper">
        <s-icon-font
          v-if="selectButton.iconRender"
          style="margin-right: 5px"
          :icon-render="selectButton.iconRender"
        />
        <caret-down-outlined class="dropdown-trigger" />
      </div>
    </a-tooltip>
  </a-popover>
  <a-tooltip
    v-else
    class="menu-disabled"
  >
    <template #title>
      对齐方式
    </template>
    <div class="shadow-bg-wrapper">
      <s-icon-font
        v-if="selectButton.iconRender"
        style="margin-right: 5px"
        :icon-render="selectButton.iconRender"
      />
      <caret-down-outlined class="dropdown-trigger" />
    </div>
  </a-tooltip>
</template>

<script setup lang="tsx">
import { Editor } from '@tiptap/core'
import {
  CaretDownOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  AlignCenterOutlined,
} from '@ant-design/icons-vue'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
import { ref, type VNode, PropType, computed } from 'vue'
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
type AlignType = 'left' | 'center' | 'right'

const isTitleActive = useActive(props.editor, Title.name)
const isLeftActive = useActive(props.editor, { textAlign: 'left' })
const isCenterActive = useActive(props.editor, { textAlign: 'center' })
const isRightActive = useActive(props.editor, { textAlign: 'right' })
const current = computed(() => {
  if (isLeftActive.value) {
    return 'left'
  } else if (isCenterActive.value) {
    return 'center'
  } else if (isRightActive.value) {
    return 'right'
  } else {
    return 'left'
  }
})
// 选中的项
const selectButton = computed(() => {
  return alignButtons.value.find((item: AlignButton) => item.key === current.value) as AlignButton
})
interface AlignButton {
  key: AlignType
  tip: string
  iconRender?: (opt?: any) => VNode
  action?: (editor: Editor) => void
}

const alignButtons = ref<AlignButton[]>([
  {
    key: 'left',
    tip: '左对齐',
    iconRender: () => <AlignLeftOutlined />,
    action: () => {
      props?.editor.chain().focus().setTextAlign('left').run()
    },
  },
  {
    key: 'center',
    tip: '居中',
    iconRender: () => <AlignRightOutlined />,
    action: () => {
      props?.editor.chain().focus().setTextAlign('center').run()
    },
  },
  {
    key: 'right',
    tip: '右对齐',
    iconRender: () => <AlignCenterOutlined />,
    action: () => {
      props?.editor.chain().focus().setTextAlign('right').run()
    },
  },
])
</script>
<style lang="less">
.align-popover-wrapper {
  .ant-popover-inner {
    border-radius: 4px;
  }
  .ant-popover-inner-content {
    padding: 3px 10px;
  }
  .align-list-wrapper {
    display: flex;
  }
}
</style>
