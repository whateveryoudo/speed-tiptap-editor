<!--
 * @Author: ykx
 * @Date: 2022-12-28 16:12:25
 * @LastEditTime: 2022-12-29 14:53:23
 * @LastEditors: your name
 * @Description: 基础插入菜单示例（用于顶部左上角和输入/快捷插入）
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\insert\baseList.vue
-->
<template>
  <div :class="['bubble-wrapper', triggerType === 'bubble' && 'bubble']">
    <a-input-search v-if="triggerType === 'menu'" v-model:value="innerQuery" placeholder="请输入功能名称" allow-clear />
    <ul class="menu-wrapper" v-if="!innerQuery">
      <li v-for="menu in menuItems" :key="menu.key" class="group-menu-item">
        <div class="sub-title">
          {{ menu.name }}
        </div>
        <!-- 最近搜索 -->
        <template v-if="menu.key === 'recent'">
          <a-space wrap>
            <a-button v-for="item in menu.children" :key="item.key" type="text" size="small"
              @click="handleEditorOpt(item)">
              <a-tag>
                {{ item.name }}
              </a-tag>
            </a-button>
          </a-space>
        </template>
        <ul :class="menu.layout === 'horizontal' ? 'flex flex-wrap gap-[2%]' : ''">
          <li v-for="subItem in menu.children" :key="subItem.key"
            :class="['menu-item shadow-bg-wrapper', selectedKey === subItem.key && 'selected']"
            @click="handleEditorOpt(subItem)"
            :style="menu.layout === 'horizontal' && (subItem.span || menu.span) ? { flexBasis: ((subItem.span || menu.span) / 24 * 100 - 1) + '%' } : {}"
            >
            <span class="left-icon">
              <s-icon-font v-if="subItem.iconRender" :icon-render="subItem.iconRender" />
              <s-icon-font v-else-if="subItem.iconType" :size="subItem.size" :type="subItem.iconType" />
            </span>

            {{ subItem.name }}
          </li>
        </ul>
      </li>
    </ul>
    <ul class="menu-wrapper" v-else-if="innerQuery && searchItems.length > 0">
      <li class="group-menu-item">
        <div class="sub-title">搜索结果：</div>
        <ul>
          <li v-for="subItem in searchItems" :key="subItem.key"
            :class="['menu-item shadow-bg-wrapper', selectedKey === subItem.key && 'selected']"
            @click="handleEditorOpt(subItem)">
            <span class="left-icon">
              <s-icon-font v-if="subItem.iconRender" :icon-render="subItem.iconRender" />
              <s-icon-font v-else-if="subItem.iconType" :size="subItem.size" :type="subItem.iconType" />
            </span>

            {{ subItem.name }}
          </li>
        </ul>
      </li>
    </ul>
    <a-empty v-else-if="innerQuery && searchItems.length === 0" description="暂无搜索结果" />
  </div>
</template>

<script setup lang="tsx">
import { type Editor } from '@tiptap/core'
import { ref, watch, computed } from 'vue'
import { type SubMenuGroup, type MenuGroup, useCommand } from './useCommand'
import { createKeysLocalStorageLRUCache } from '@/helpers/lru-cache';
const recentMenuListCache = createKeysLocalStorageLRUCache('RECENT_MENU_LIST', 20);

const props = withDefaults(defineProps<{
  editor: Editor,
  query?: string, // 搜索关键字
  command: Function,
  items?: MenuGroup[], // 这里是气泡菜单的items，目前菜单是没有用到此参数
  triggerType: 'bubble' | 'menu',
}>(), {
  triggerType: 'menu',
  query: '',
  command: () => { },
  items: () => [],
  editor: () => ({}) as unknown as Editor,
})
const selectedKey = ref('1-1')
const innerQuery = ref('');
const selectedIndex = ref(0)
const emit = defineEmits(['triggerVisible'])
const recentMenuList = ref<any[]>([]);
const { menuGroup, flatLeafMenu } = useCommand()
const currentMenuItems = computed(() => {
  return innerQuery.value ? searchItems.value : flatLeafMenu.value
})
// 区分不同类型点击
const handleEditorOpt = (item?: SubMenuGroup) => {
  if (!item) {
    return
  }
  recentMenuListCache.put(item);
  recentMenuList.value = recentMenuListCache.get() as any[]
  if (props.triggerType === 'bubble') {
    props.command && props.command(item)
  } else {
    item.action && item.action(props.editor)
    emit('triggerVisible', false)
  }
}
const selectItem = (index: number) => {
  const item = currentMenuItems.value[index]

  if (item) {
    handleEditorOpt(item)
  }
}
// 搜索结果
const searchItems = computed(() => {
  return flatLeafMenu.value.filter((item) => item.name.includes(innerQuery.value))
})
const upHandler = () => {
  selectedIndex.value = (selectedIndex.value + currentMenuItems.value.length - 1) % currentMenuItems.value.length
}
const downHandler = () => {
  selectedIndex.value = (selectedIndex.value + 1) % currentMenuItems.value.length
}
const menuItems = computed(() => {
  // 追加最近搜索项
  return [
    recentMenuList.value.length > 0 ? {
      key: 'recent',
      name: '最近搜索',
      children: recentMenuList.value,
    } : null,
    ...menuGroup.value,
  ].filter((item) => item !== null) as MenuGroup[]
})
watch(
  () => flatLeafMenu.value,
  () => {
    selectedIndex.value = 0
  },
)
watch(
  () => props.query,
  () => {
    innerQuery.value = props.query
  },
)
watch(selectedIndex, (val: number) => {
  console.log(val)
  selectedKey.value = currentMenuItems.value[val]?.key
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

  // 气泡提示需要自行添加样式
  &.bubble {
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
      color: var(--ant-color-text-secondary);
    }

    .menu-item {
      height: 40px;
      padding: 0 10px;
      margin: 5px 0;
      justify-content: flex-start;
      align-items: center;
      font-size: 14px;

      .left-icon {
        display: inline-flex;
        align-items: center;
      }

      :deep(.anticon) {
        margin-right: 5px;
      }

      &.selected {
        background-color: var(--ant-color-fill-secondary) !important;
      }
    }
  }
}
</style>
