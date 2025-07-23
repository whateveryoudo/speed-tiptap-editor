<!--
 * @Author: ykx
 * @Date: 2022-11-18 17:07:13
 * @LastEditTime: 2022-12-02 18:21:14
 * @LastEditors: Please set LastEditors
 * @Description: 表情选择器
 * @FilePath: \we-knowledge-base\src\components\colorPicker\index.vue
-->

<template>
  <a-popover :open="visible" @openChange="val => visible = val" v-if="!disabled"
    overlay-class-name="emoji-board-popover-wrapper" trigger="click" placement="bottomLeft">
    <template #content>
      <a-flex vertical class="emoji-board-wrapper" ref="emojiWrapperRef">
        <a-input-search v-model:value="searchValue" placeholder="搜索表情" style="margin-bottom: 8px" allow-clear />
        <div class="flex-1 overflow-y-auto emoji-scroll-wrapper">
          <ul class="emoji-board-group-wrapper" v-if="filteredEmojiList.length > 0">
            <li v-for="(item, index) in filteredEmojiList" :key="index" class="emoji-board-group-item">
              <span class="group-title" :id="'group-' + index">{{ item.title }}</span>
              <ul class="emoji-board-list-wrapper">
                <li v-for="(em, eIndex) in item.data" :key="eIndex" class="shadow-bg-wrapper emoji-board-list-item"
                  @click="onSelectEmoji(em.text)">
                  <a-tooltip :title="em.zh_cn" :arrow="false" placement="top">
                    <span>{{ em.text }}</span>
                  </a-tooltip>
                </li>
              </ul>
            </li>
          </ul>
          <a-empty v-else description="无匹配表情" />
        </div>
        <!-- 分组锚点导航（Antd Anchor） -->
        <a-anchor :getContainer="getEmojiScrollContainer" :affix="false" direction="horizontal" :showInkInFixed="false"
          class="emoji-board-anchor">
          <a-anchor-link v-for="(item, idx) in LIST" :key="item.title" :href="'#group-' + idx" :title="item.title" />
        </a-anchor>
      </a-flex>
    </template>
    <slot />
  </a-popover>
  <slot v-else />
</template>

<script setup lang="tsx">
import { ref, PropType, computed, nextTick, onMounted } from 'vue'
import { createKeysLocalStorageLRUCache } from '@/helpers/lru-cache';
import { ACTIVITIES, EXPRESSIONES, GESTURES, OBJECTS, SKY_WEATHER, SYMBOLS } from './data';

const EMOJI_CACHE_KEY = 'RECENT_EMOJI_LIST'
const MAX_EMOJI_COUNT = 20
const emojiCache = createKeysLocalStorageLRUCache(EMOJI_CACHE_KEY, MAX_EMOJI_COUNT);

const props = defineProps({
  showDefault: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const recentUseList = ref<any[]>([]);
const searchValue = ref('');
const emojiWrapperRef = ref<HTMLElement | null>(null)
const LIST = [
  { title: '表情', data: EXPRESSIONES },
  { title: '天气', data: SKY_WEATHER },
  { title: '手势', data: GESTURES },
  { title: '符号', data: SYMBOLS },
  { title: '物体', data: OBJECTS },
  { title: '运动', data: ACTIVITIES },
];
const allEmojiList = computed(() => {
  return recentUseList.value.length > 0 ? [{ title: '最近使用', data: recentUseList.value }, ...LIST] : LIST;
})
const filteredEmojiList = computed(() => {
  if (!searchValue.value) return allEmojiList.value;
  // 只保留有匹配的分组
  return allEmojiList.value
    .map(group => ({
      ...group,
      data: group.data.filter(em => em.zh_cn.includes(searchValue.value))
    }))
    .filter(group => group.data.length > 0);
});
const emit = defineEmits(['triggerEmoji'])
const visible = ref(false)
const onSelectEmoji = (emoji: any) => {
  emojiCache.put(emoji);
  // 重新加载以获取最新顺序
  const cachedEmojis = emojiCache.get();
  if (Array.isArray(cachedEmojis)) {
    recentUseList.value = cachedEmojis;
  }
  emit('triggerEmoji', emoji)
  visible.value = false
}
// Anchor锚点导航需要的容器获取方法
const getEmojiScrollContainer = () => document.querySelector('.emoji-scroll-wrapper') || null

// 初始化时加载
onMounted(() => {
  const cachedEmojis = emojiCache.get();
  if (Array.isArray(cachedEmojis)) {
    recentUseList.value = cachedEmojis;
  }
});
</script>

<style lang="less">
.emoji-board-popover-wrapper {
  width: 350px;

  .ant-popover-inner {
    padding: 5px;
    padding-top: 10px;
  }

  .emoji-board-group-item {
    margin-bottom: 5px;
  }

  .group-title {
    padding-left: 5px;
    color: #8a8f8d;
  }

  .emoji-board-wrapper {
    height: 400px;

    .emoji-scroll-wrapper {
      overflow-y: auto;
    }

    .emoji-board-list-wrapper {
      margin: 0;
      font-size: 0;
      display: flex;
      flex-wrap: wrap;

      .emoji-board-list-item {
        display: flex;
        margin: 2px;
        padding: 6px;
        justify-content: center;
        align-items: center;
        width: 32px;
        height: 32px;
        font-size: 24px;
        border-radius: 3px;
        cursor: pointer;
      }
    }

  }

  .ant-anchor {
    display: flex;
    padding: 0 5px;
    justify-content: space-around;
    border-top: 1px solid var(--ant-color-border-secondary);
  }
}
</style>
