<script setup>
import { ref } from 'vue'
import { SpeedTiptapEditor } from '@/main'

const content = ref('<p>欢迎使用 Speed Tiptap Editor！</p>')

const onUpdate = (content) => {
  console.log(content)
}
</script>

<template>
   <SpeedTiptapEditor
      v-model:content="content"
      @update="onUpdate"
    />
 
</template>

<style scoped>


</style>
