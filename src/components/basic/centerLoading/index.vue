<!--
 * @Author: ykx
 * @Date: 2022-12-13 19:48:49
 * @LastEditTime: 2022-12-13 19:49:55
 * @LastEditors: your name
 * @Description: 居中loading
 * @FilePath: \we-knowledge-base\src\components\basic\centerLoading\index.vue
-->
<template>
  <div class="center-wrapper">
    <a-spin class="center-loading" :spinning="loading" v-bind="$attrs" />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 's-center-loading',
})
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped lang="less"></style>
