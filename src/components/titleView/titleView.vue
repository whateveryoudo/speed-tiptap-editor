<template>
  <h2 class="title"> 
    {{ title }}
  </h2>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: '标题',
  },
})
</script>

<style lang="less">
.title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}
.dark .title {
  color: #fff;
}
</style>
