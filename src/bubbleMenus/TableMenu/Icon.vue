<script lang="ts" setup>
defineProps<{
  type: string
}>()
</script>

<template>
  <i class="icon">
    <svg viewBox="0 0 1024 1024">
      <use :xlink:href="`#${type}`"></use>
    </svg>
  </i>
</template>

<style lang="less" scoped>
.icon {
  display: inline-block;
  line-height: 0;
  text-align: center;
  vertical-align: -0.25em;
  transition: color;
  svg {
    width: 1em;
    height: 1em;
    overflow: hidden;
    fill: currentColor;
  }
}
</style>
