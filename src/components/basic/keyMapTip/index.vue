<!--
 * @Author: ykx
 * @Date: 2022-12-16 17:30:55
 * @LastEditTime: 2022-12-16 19:10:59
 * @LastEditors: your name
 * @Description: 带有快捷键tip显示
 * @FilePath: \we-knowledge-base\src\components\basic\keyMapTip\index.vue
-->
<template>
  <div class="keymap-tip-wrapper">
    <span>{{ title }}</span>
    <span v-if="keyMap" class="mt-2 text-[#8A8F8D] text-xs">{{ keyMap }}</span>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 's-keymap-tip',
})
defineProps({
  title: {
    type: String,
    default: '',
  },
  keyMap: {
    type: String,
    default: '',
  },
})
</script>

<style scoped lang="less">
.keymap-tip-wrapper {
  max-width: 200px;
  display: flex;
  flex-direction: column;
  color: #fff;
}
</style>
