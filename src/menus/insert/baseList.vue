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
          <a-space wrap class="recent-menu-items">
            <a-button v-for="item in menu.children" :key="item.key" type="text" size="small"
              @click="handleEditorOpt(item)">
              {{ item.name }}
            </a-button>
          </a-space>
        </template>
        <ul v-else :class="menu.layout === 'horizontal' ? 'flex flex-wrap gap-[2%]' : ''">
          <template v-for="subItem in menu.children" :key="subItem.key">
            <a-popover v-if="subItem.hasMore" placement="right">
              <template #content>
                <AutoExpandTableSelect v-if="subItem.key === 'table'"
                  @select="(payload: any) => handleTableSelect(subItem, payload)" />
              </template>
              <li :class="['menu-item shadow-bg-wrapper relative', selectedKey === subItem.key && 'selected']"
                @click="handleEditorOpt(subItem)"
                :style="menu.layout === 'horizontal' ? { flexBasis: ((menu.span || 12) / 24 * 100 - 1) + '%' } : {}">
                <span class="left-icon">
                  <s-icon-font v-if="subItem.iconRender" :icon-render="subItem.iconRender" />
                  <s-icon-font v-else-if="subItem.iconType" :size="subItem.size" :type="subItem.iconType" />
                  <img v-else-if="subItem.imgIcon" :src="subItem.imgIcon" alt="">
                </span>
                {{ subItem.name }}
                <RightOutlined
                  class="absolute right-[10px] top-[50%] translate-y-[-50%] text-[var(--ant-color-text-tertiary)]" />

              </li>
            </a-popover>
            <li v-else :class="['menu-item shadow-bg-wrapper', selectedKey === subItem.key && 'selected']"
              @click="handleEditorOpt(subItem)"
              :style="menu.layout === 'horizontal' ? { flexBasis: ((menu.span || 12) / 24 * 100 - 1) + '%' } : {}">
              <span class="left-icon">
                <s-icon-font v-if="subItem.iconRender" :icon-render="subItem.iconRender" />
                <s-icon-font v-else-if="subItem.iconType" :size="subItem.size" :type="subItem.iconType" />
                <img v-else-if="subItem.imgIcon" :src="subItem.imgIcon" alt="">
              </span>
              {{ subItem.name }}
              <!-- file,img隐藏一个input，点击后选择文件 -->
              <template v-if="['file', 'img'].includes(subItem.key)">
                <input :ref="el => inputRefs[subItem.key] = el" @change="handleFileChange(subItem, $event)" multiple
                  v-if="subItem.key === 'img'" type="file" accept=".svg,.png,.bmp,.jpg,.jpeg,.gif,.webp,.heic" hidden>
                <input :ref="el => inputRefs[subItem.key] = el" @change="handleFileChange(subItem, $event)" multiple
                  v-else type="file"
                  accept=".docx,.doc,.txt,.lake,.lakebook,.lakesheet,.pdf,.xls,.xlsx,.xlsm,.csv,.pptx,.ppt,.pages,.numbers,.key,.keynote,.md,.mark,.markdown,.xmind,.mindnode,.mmap,.mm,.rp,.psd,.sketch,.svg,.png,.bmp,.jpg,.jpeg,.gif,.webp,.heic,.heif,.ts,.mp3,.mpga,.wav,.bat,.c,.cpp,.css,.go,.h,.java,.js,.json,.jsonl,.log,.m,.mkd,.php,.py,.r,.sh,.sql,.xml,.jmx,.yaml,.yml,.ipynb"
                  hidden>
              </template>
            </li>
          </template>
        </ul>
      </li>
    </ul>
    <ul class="menu-wrapper" v-else-if="innerQuery && searchItems.length > 0">
      <li class="group-menu-item">
        <!-- 这里是一维的 -->
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
import { ref, watch, computed, onMounted } from 'vue'
import { type SubMenuGroup, type MenuGroup, useCommand } from './useCommand'
import { createKeysLocalStorageLRUCache } from '@/helpers/lru-cache';
import AutoExpandTableSelect from './autoExpandTableSelect.vue'

const { menuGroup, flatLeafMenu } = useCommand()
const cacheKey = 'RECENT_MENU_LIST'
// 创建最近使用菜单的LRU缓存，最多存储20条
const recentMenuListCache = createKeysLocalStorageLRUCache(cacheKey, 20);
const recentMenuList = ref<SubMenuGroup[]>([]);

// 从扁平菜单中查找对应的菜单项
function findMenuItem(key: string): SubMenuGroup | undefined {
  return flatLeafMenu.value.find(item => item.key === key);
}

// 初始化加载最近使用的菜单
onMounted(() => {
  const cachedKeys = recentMenuListCache.get() as string[];
  if (Array.isArray(cachedKeys)) {
    recentMenuList.value = cachedKeys
      .map(key => findMenuItem(key))
      .filter((item): item is SubMenuGroup => item !== undefined);
  }
})

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
const inputRefs = ref<Record<string, HTMLInputElement>>({})

const selectedKey = ref('1-1')
const innerQuery = ref('');
const selectedIndex = ref(0)
const emit = defineEmits(['triggerVisible'])

// 当前显示的菜单项
const currentMenuItems = computed(() => {
  return innerQuery.value ? searchItems.value : flatLeafMenu.value
})

// 表格选择插入
const handleTableSelect = (item: SubMenuGroup, payload: { rows: number, cols: number }) => {
  console.log(payload);
  handleEditorOpt(item, payload)
}

// 区分不同类型点击
const handleEditorOpt = (item?: SubMenuGroup, payload?: any) => {
  if (!item) {
    return
  }
  // 更新最近使用菜单缓存，只存储 key
  recentMenuListCache.put(item.key);
  const cachedKeys = recentMenuListCache.get() as string[];
  if (Array.isArray(cachedKeys)) {
    recentMenuList.value = cachedKeys
      .map(key => findMenuItem(key))
      .filter((item): item is SubMenuGroup => item !== undefined);
  }
  if (item.key === 'img') {
    // 查找下方的input，并触发点击
    const inputRef = inputRefs.value[item.key]
    if (inputRef) {
      inputRef.click()
    }
    return;
  }


  if (props.triggerType === 'bubble') {
    props.command && props.command(item)
  } else {
    item.action && item.action(props.editor, payload)
    emit('triggerVisible', false)
  }
}
// 文件/图片 选择
const handleFileChange = (item: SubMenuGroup, event: any) => {
  console.log(item, event)
  if (props.triggerType === 'bubble') {
    props.command && props.command(item)
  } else {
    item.action && item.action(props.editor, event?.target?.files)
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
  // 只有存在最近使用记录时才显示"最近搜索"分组
  const items: (MenuGroup | null)[] = [
    recentMenuList.value.length > 0 ? {
      key: 'recent',
      name: '最近搜索',
      layout: 'horizontal' as const,
      children: recentMenuList.value,
    } : null,
    ...menuGroup.value,
  ];

  return items.filter((item): item is MenuGroup => item !== null);
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

  .recent-menu-items {
    :deep(.ant-btn) {
      background-color: var(--ant-color-fill-secondary);

      &:hover {
        background-color: var(--ant-color-fill);
      }
    }
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
      height: auto;
      margin: 5px 0;
      justify-content: flex-start;
      align-items: center;
      font-size: 14px;

      .left-icon {
        width: 36px;
        height: 36px;
        margin-right: 10px;

        &>img {
          width: 100%;
          height: auto;
        }
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
