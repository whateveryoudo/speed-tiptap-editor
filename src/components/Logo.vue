<template>
  <img class="h-6 relative top-6" :src="logoSrc" :title="layoutSetting.title" />
</template>

<script lang="ts" setup>
import logoSrc from '@st/assets/image/logo.svg'
import { layoutSetting } from '@st/config/globalSetting'
</script>
