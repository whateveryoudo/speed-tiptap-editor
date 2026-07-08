<script setup lang="ts">
import { computed } from 'vue'
import { SpeedEditor } from '@speed-tiptap-editor/base-editor'
import type { SpeedEditorShellProps } from '@speed-tiptap-editor/shared'
import { createLiteEditorPlugins } from './createLiteEditorPlugins'
import { liteLayout } from './preset'

const props = withDefaults(defineProps<SpeedEditorShellProps>(), {
  editable: false,
  menubar: false,
  hideBorder: false,
})

const plugins = computed(() => createLiteEditorPlugins())
</script>

<template>
  <SpeedEditor v-bind="props" :layout="liteLayout" :plugins="plugins" />
</template>
