<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import type { BubbleMenuKey } from '@speed-tiptap-editor/shared'

const props = defineProps<{
  editor: unknown
  bubbleMenus: BubbleMenuKey[]
  registry: Partial<Record<BubbleMenuKey, Component[]>>
  textBubbleMenuEnabled?: boolean
}>()

const activeMenus = computed(() =>
  props.bubbleMenus.filter((key) => {
    if (key === 'text') return props.textBubbleMenuEnabled !== false
    return true
  }),
)
</script>

<template>
  <template v-for="key in activeMenus" :key="key">
    <component
      v-for="(Comp, idx) in registry[key] ?? []"
      :key="`${key}-${idx}`"
      :is="Comp"
      :editor="editor"
    />
  </template>
</template>
