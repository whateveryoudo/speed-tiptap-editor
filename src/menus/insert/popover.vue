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
    v-model:visible="visible"
    overlay-class-name="menu-popover-wrapper"
    trigger="click"
    placement="bottomLeft">
    <template #content>
      <base-list :full-items="menuGroup" :editor="editor" @triggerVisible="(val:boolean) => visible = val"/>
    </template>
    <a-tooltip>
      <template #title> 插入 </template>
      <div class="shadow-bg-wrapper">
        <plus-circle-filled class="tip-icon" />
      </div>
    </a-tooltip>
  </a-popover>
</template>

<script setup lang="tsx">
import { PropType, ref } from 'vue'
import { Editor } from '@tiptap/core'
import BaseList from './baseList.vue'
import { useCommand } from './useCommand'

import {
  PlusCircleFilled,
} from '@ant-design/icons-vue'

const { menuGroup } = useCommand()

defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const visible = ref(false)

</script>
<style lang="less">
.menu-popover-wrapper {
  .ant-popover-inner {
    border-radius: 4px;
  }
  .ant-popover-inner-content {
    padding: 3px 10px;
  }
}
</style>
<style scoped lang="less">

.tip-icon {
  font-size: 18px;
  color: var(--ant-color-primary);
}
</style>
