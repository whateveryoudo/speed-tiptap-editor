
<template>
  <Tooltip :title="title" v-model:open="open">
    <div @click="open = false">
      <slot />
    </div>
  </Tooltip>
</template>

<script setup lang="ts">
import { Tooltip } from 'ant-design-vue'
import { ref } from 'vue'

defineOptions({ name: 'SpeedTooltip' })

withDefaults(defineProps<{ title?: string }>(), { title: '' })

const open = ref(false)
</script>
