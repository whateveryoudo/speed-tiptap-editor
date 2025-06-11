<!--
 * @Author: ykx
 * @Date: 2022-12-28 16:12:25
 * @LastEditTime: 2022-12-29 14:53:23
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\insert\baseList.vue
-->
<template>
  <div :class="['bubble-wrapper', noPopover && 'no-popover']">
    <ul class="menu-wrapper" v-if="!query">
      <li v-for="menu in fullItems" :key="menu.key" class="group-menu-item">
        <div class="sub-title">
          {{ menu.name }}
        </div>
        <ul>
          <li
            v-for="subItem in menu.children"
            :key="subItem.key"
            :class="['menu-item shadow-bg-wrapper', selectedKey === subItem.key && 'selected']"
            @click="handleEditorOpt(subItem)">
            <span class="left-icon">
              <s-icon-font v-if="subItem.iconRender" :icon-render="subItem.iconRender" />
              <s-icon-font
                v-else-if="subItem.iconType"
                :size="subItem.size"
                :type="subItem.iconType" />
            </span>

            {{ subItem.name }}
          </li>
        </ul>
      </li>
    </ul>
    <ul class="menu-wrapper" v-else-if="query && items.length > 0">
      <li class="group-menu-item">
        <div class="sub-title">搜索结果：</div>
        <ul>
          <li
            v-for="subItem in items"
            :key="subItem.key"
            :class="['menu-item shadow-bg-wrapper', selectedKey === subItem.key && 'selected']"
            @click="handleEditorOpt(subItem)">
            <span class="left-icon">
              <s-icon-font v-if="subItem.iconRender" :icon-render="subItem.iconRender" />
              <s-icon-font
                v-else-if="subItem.iconType"
                :size="subItem.size"
                :type="subItem.iconType" />
            </span>

            {{ subItem.name }}
          </li>
        </ul>
      </li>
    </ul>
    <a-empty v-else-if="query && items.length === 0" description="暂无搜索结果" />
  </div>
</template>

<script setup lang="tsx">
import { type Editor } from '@tiptap/core'
import { ref, PropType, watch } from 'vue'
import { type SubMenuGroup, type MenuGroup } from './useCommand'
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
  items: {
    type: Array as PropType<Array<SubMenuGroup>>,
    default: () => [],
  },
  query: {
    type: String,
    default: '',
  },
  command: {
    type: Function,
  },
  fullItems: {
    type: Array as PropType<Array<MenuGroup>>,
    required: true,
  },
  noPopover: {
    type: Boolean,
    default: false,
  },
})
const selectedKey = ref('1-1')
const selectedIndex = ref(0)
const emit = defineEmits(['triggerVisible'])

// 区分不同类型点击
const handleEditorOpt = (item?: SubMenuGroup) => {
  if (!item) {
    return
  }
  if (props.noPopover) {
    props.command && props.command(item)
  } else {
    item.action && item.action(props.editor)
    emit('triggerVisible', false)
  }
}
const selectItem = (index: number) => {
  const item = props.items[index]

  if (item) {
    handleEditorOpt(item)
  }
}
const upHandler = () => {
  selectedIndex.value = (selectedIndex.value + props.items.length - 1) % props.items.length
}
const downHandler = () => {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length
}
watch(
  () => props.items,
  () => {
    selectedIndex.value = 0
  },
)
watch(selectedIndex, (val: number) => {
  console.log(val)
  selectedKey.value = props.items[val]?.key
})
const enterHandler = () => {
  selectItem(selectedIndex.value)
}
const onKeyDown = ({ event }: any) => {
  if (event.key === 'ArrowUp') {
    upHandler()
    return true
  }

  if (event.key === 'ArrowDown') {
    downHandler()
    return true
  }

  if (event.key === 'Enter') {
    enterHandler()
    return true
  }

  return false
}
defineExpose({
  onKeyDown,
})
</script>

<style scoped lang="less">
.bubble-wrapper {
  &.no-popover {
    background-color: #fff;
    padding: 3px 10px;
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12%), 0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 9px 28px 8px rgba(0, 0, 0, 0.05);
  }
}
.menu-wrapper {
  min-width: 200px;
  margin: 0;
  .group-menu-item {
    .sub-title {
      margin-top: 12px;
      margin-bottom: 4px;
      line-height: 20px;
      font-size: 12px;
      color: var(--ant-gray-color);
    }
    .menu-item {
      height: 40px;
      padding: 0 10px;
      margin: 5px 0;
      justify-content: flex-start;
      align-items: center;
      .left-icon {
        display: inline-flex;
        align-items: center;
      }
      :deep(.anticon) {
        margin-right: 5px;
      }
      &.selected {
        background-color: var(--ant-gray-bg) !important;
      }
    }
  }
}
</style>
