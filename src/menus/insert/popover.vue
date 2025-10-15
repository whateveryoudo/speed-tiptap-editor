<!--
 * @Author: ykx
 * @Date: 2022-11-10 19:15:40
 * @LastEditTime: 2022-12-29 11:37:00
 * @LastEditors: your name
 * @Description: 插入菜单
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\insert\popover.vue
-->
<template>

  <a-popover v-if="!isTitleActive" v-model:open="open" overlay-class-name="menu-popover-wrapper" trigger="click"
    placement="bottomLeft">
    <template #content>
      <base-list :editor="editor" :insert-menu-config="insertMenuConfig" trigger-type="menu"
        @triggerVisible="(val: boolean) => open = val" />
    </template>
    <a-tooltip>
      <template #title> 插入 </template>
      <a-button type="text" class="shadow-btn-wrapper" :disabled="isTitleActive">
        <plus-circle-filled :class="['tip-icon', isTitleActive && 'disabled']" />
      </a-button>
    </a-tooltip>
  </a-popover>
  <a-tooltip v-else>
    <template #title> 插入 </template>
    <a-button type="text" class="shadow-btn-wrapper" :disabled="isTitleActive">
      <plus-circle-filled :class="['tip-icon', isTitleActive && 'disabled']" />
    </a-button>
  </a-tooltip>
</template>

<script setup lang="tsx">
import { PropType, ref } from 'vue'
import { Editor } from '@tiptap/core'
import BaseList from './baseList.tsx'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
import {
  PlusCircleFilled,
} from '@ant-design/icons-vue'


const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
  insertMenuConfig: {
    type: Object as PropType<Record<string, any>>,
    default: undefined,
  },
})
const open = ref(false)
const isTitleActive = useActive(props.editor, Title.name)

</script>
<style lang="less">
.menu-popover-wrapper {
  .ant-popover-inner {
    border-radius: 4px;
  }

  .ant-popover-inner {
    padding: 15px 20px;
  }
}
</style>
<style scoped lang="less">
.tip-icon {
  font-size: 18px;
  color: var(--ant-color-primary);

  &.disabled {
    opacity: 0.5;
  }
}
</style>
