
<template>
  <!-- 某些场景可能直接使用tooltip，气泡不会消失 -->
  <a-tooltip :title="title" v-model:open="open">
    <!-- 支持自身点击关闭的tooltip -->
    <div @click="open = false">
      <slot />
    </div>
  </a-tooltip>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineOptions({
  name: 'SpeedTooltip',
});
const open = ref(false);
const props = withDefaults(defineProps<{
  title: string;
}>(), {
  title: '',
});

</script>

<style scoped lang="less"></style>