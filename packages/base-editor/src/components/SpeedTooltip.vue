
<template>
  <a-tooltip :title="title" v-model:open="open">
    <div @click="open = false">
      <slot />
    </div>
  </a-tooltip>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'SpeedTooltip' })

withDefaults(defineProps<{ title?: string }>(), { title: '' })

const open = ref(false)
</script>
