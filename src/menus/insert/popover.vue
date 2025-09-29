<!--
 * @Author: ykx
 * @Date: 2022-11-10 19:15:40
 * @LastEditTime: 2022-12-29 11:37:00
 * @LastEditors: your name
 * @Description: 插入菜单
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\insert\popover.vue
-->
<template>
  <a-popover
    v-model:open="open"
    overlay-class-name="menu-popover-wrapper"
    trigger="click"
    placement="bottomLeft">
    <template #content>
      <base-list 
        :editor="editor" 
        :insert-menu-config="insertMenuConfig"
        trigger-type="menu" 
        @triggerVisible="(val:boolean) => open = val"/>
    </template>
    <a-tooltip>
      <template #title> 插入 </template>
      <a-button type="text" class="shadow-btn-wrapper">
        <plus-circle-filled class="tip-icon" />
      </a-button>
    </a-tooltip>
  </a-popover>
</template>

<script setup lang="tsx">
import { PropType, ref } from 'vue'
import { Editor } from '@tiptap/core'
import BaseList from './baseList.tsx'

import {
  PlusCircleFilled,
} from '@ant-design/icons-vue'


defineProps({
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
}
</style>
