<!--
 * @Author: ykx
 * @Date: 2022-11-10 19:15:40
 * @LastEditTime: 2022-12-08 11:31:44
 * @LastEditors: your name
 * @Description: 对齐设置（已废弃）
 * @FilePath: \we-knowledge-base\src\tiptap\editor\collaboration\bubbleMenus\ImageMenu\AlignSetting.vue
-->
<template>
  <a-popover v-model:visible="visible" overlay-class-name="align-popover-wrapper" trigger="click" placement="bottom">
    <template #content>
      <a-space class="align-list-wrapper">
        <a-tooltip v-for="item in alignButtons" :key="item.key">
          <template #title>
            {{ item.tip }}
          </template>
          <a-button type="text" :class="['shadow-btn-wrapper', selectButton.key === item.key && 'is-active']" @click="visible = false;
          emit('triggerAlign', item.key)">
            <s-icon-font v-if="item.iconRender" :icon-render="item.iconRender" />
          </a-button>
        </a-tooltip>
      </a-space>
    </template>
    <a-tooltip>
      <template #title> 对齐方式 </template>
      <div class="shadow-bg-wrapper">
        <s-icon-font v-if="selectButton.iconRender" style="margin-right: 5px" :icon-render="selectButton.iconRender" />
        <caret-down-outlined class="dropdown-trigger" />
      </div>
    </a-tooltip>
  </a-popover>
</template>

<script setup lang="tsx">
import { Editor } from '@tiptap/core'
import {
  CaretDownOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  AlignCenterOutlined,
} from '@ant-design/icons-vue'
import { ref, type VNode, PropType, computed } from 'vue'
type AlignType = 'left' | 'center' | 'right'
const emit = defineEmits(['triggerAlign'])
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
  activeKey: {
    type: String as PropType<AlignType>,
    default: 'left',
  },
})
const visible = ref(false)
// 选中的项
const selectButton = computed(() => {
  return alignButtons.value.find((item: AlignButton) => item.key === props.activeKey) as AlignButton
})
interface AlignButton {
  key: AlignType
  tip: string
  iconRender?: (opt?: any) => VNode
}

const alignButtons = ref<AlignButton[]>([
  {
    key: 'left',
    tip: '左对齐',
    iconRender: () => <AlignLeftOutlined />,
  },
  {
    key: 'center',
    tip: '居中',
    iconRender: () => <AlignRightOutlined />,
  },
  {
    key: 'right',
    tip: '右对齐',
    iconRender: () => <AlignCenterOutlined />,
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
