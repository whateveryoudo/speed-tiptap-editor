<!--
 * @Author: ykx
 * @Date: 2022-11-18 17:07:13
 * @LastEditTime: 2022-12-02 18:21:14
 * @LastEditors: Please set LastEditors
 * @Description: 表情选择器
 * @FilePath: \we-knowledge-base\src\components\colorPicker\index.vue
-->

<template>
  <a-popover :visible="visible" @visibleChange="val => visible = val" v-if="!disabled" overlay-class-name="emoji-board-popover-wrapper" trigger="click"
    placement="bottomLeft">
    <template #content>
      <div class="emoji-board-wrapper">
        <ul class="emoji-board-group-wrapper">
          <li v-for="(item, index) in allEmojiList" :key="index" class="emoji-board-group-item">
            <span class="group-title">{{ item.title }}</span>
            <ul class="emoji-board-list-wrapper">
              <li v-for="(em, eIndex) in item.data" :key="eIndex" class="shadow-bg-wrapper emoji-board-list-item"
                @click="onSelectEmoji(em)">
                {{ em }}</li>
            </ul>
          </li>
        </ul>
      </div>
    </template>
    <slot />
  </a-popover>
  <slot v-else />
</template>

<script setup lang="tsx">
import { ref, PropType, computed } from 'vue'
import { createKeysLocalStorageLRUCache } from '@/helpers/lru-cache';
import { ACTIVITIES, EXPRESSIONES, GESTURES, OBJECTS, SKY_WEATHER, SYMBOLS } from './data';
const emojiLocalStorageLRUCache = createKeysLocalStorageLRUCache('EMOJI_PICKER', 20);

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
const recentUseList = ref<string[]>([]);
const LIST = [
  {
    title: '表情',
    data: EXPRESSIONES,
  },
  {
    title: '天气',
    data: SKY_WEATHER,
  },
  {
    title: '手势',
    data: GESTURES,
  },
  {
    title: '符号',
    data: SYMBOLS,
  },
  {
    title: '物体',
    data: OBJECTS,
  },
  {
    title: '运动',
    data: ACTIVITIES,
  },
];
const allEmojiList = computed(() => {
  return recentUseList.value.length > 0 ? [{ title: '最近使用', data: recentUseList.value }, ...LIST] : LIST;
})
const emit = defineEmits(['triggerEmoji'])
const visible = ref(false)
const onSelectEmoji = (emoji: any) => {
  emojiLocalStorageLRUCache.put(emoji);
  recentUseList.value = emojiLocalStorageLRUCache.get() as string[]
  emit('triggerEmoji', emoji)
  visible.value = false
}
</script>
<style lang="less">
.emoji-board-popover-wrapper {
  width: 342px;


  .ant-popover-inner-content {
    padding: 5px;
    max-height: 300px;
    overflow-y: auto;
  }

  .emoji-board-group-item{
    margin-bottom: 5px;
  }
  .group-title {
    padding-left: 5px;
    color: #8a8f8d;
  }

  .emoji-board-wrapper {
    padding-top: 5px;

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
}
</style>
