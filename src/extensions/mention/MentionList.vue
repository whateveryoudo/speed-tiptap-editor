<!--
 * @Author: ykx
 * @Date: 2022-12-29 14:57:59
 * @LastEditTime: 2022-12-29 16:08:15
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\mention\MentionList.vue
-->
<template>
  <ul class="text-list-wrapper" ref="ulRef">
    <li
      v-for="(item, index) in items"
      :key="index"
      :class="[
        'shadow-bg-wrapper overflow-hidden-one',
        'list-item',
        index === selectedIndex && 'is-active',
      ]"
      @click="selectItem(index)"
      :title="item">
      {{ item }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import scrollIntoView from 'scroll-into-view-if-needed'

import { PropType, ref, watch } from 'vue'
const props = defineProps({
  items: {
    type: Array as PropType<Array<string>>,
    required: true,
  },

  command: {
    type: Function,
    required: true,
  },

  editor: {
    type: Object,
    required: true,
  },
})
const selectedIndex = ref(0)
const ulRef = ref<HTMLDivElement>()
//监听index变化滚动
watch(selectedIndex, (val: number) => {
  // if (Number.isNaN(selectedIndex.value + 1)) return
  const el = ulRef.value?.querySelector(`li:nth-of-type(${val + 1})`)
  el && scrollIntoView(el, { behavior: 'smooth', scrollMode: 'if-needed' })
})
watch(
  () => props.items,
  () => {
    selectedIndex.value = 0
  },
)
const selectItem = (index: number) => {
  const item = props.items[index]
  if (item) {
    props.command({ id: item, label: item })
  }
}
const upHandler = () => {
  selectedIndex.value = (selectedIndex.value + props.items.length - 1) % props.items.length
}

const downHandler = () => {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length
}

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
.text-list-wrapper {
  width: 200px;
  max-height: 320px;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #fff;
  border-radius: var(--border-radius);
  margin: 0;
  box-shadow: rgba(9, 30, 66, 0.31) 0 0 1px, rgba(9, 30, 66, 0.25) 0 4px 8px -2px;
  .list-item {
    padding: 0 10px;
    height: 35px;
    line-height: 35px;
    & > span {
      margin-right: 5px;
      position: relative;
      top: 1px;
    }
  }
}
</style>
