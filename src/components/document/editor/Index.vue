<!--
 * @Author: ykx
 * @Date: 2022-11-10 15:27:47
 * @LastEditTime: 2022-11-29 19:59:37
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\components\document\editor\Index.vue
-->
<template>
  <a-layout class="editor-layout">
    <a-layout-header style="background-color: #fff">
      <div class="left-wrapper">
        <span
          class="shadow-bg-wrapper inline"
          @click="$router.go(-1)"
        > 
          <left-outlined />
        </span>
        {{ docTitle }}
      </div>
      <div class="right-wrapper" />
    </a-layout-header>
    <a-layout-content>
      <CollaborationEditor @onTitleUpdate="updateTitle" />
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CollaborationEditor } from '@/tiptap/editor'
import { LeftOutlined } from '@ant-design/icons-vue'
import { documentEditorProps } from './editor'
const props = defineProps(documentEditorProps)
const docTitle = ref(props?.document?.title);
const updateTitle = (title:string) => {
  docTitle.value = title;
}

</script>

<style scoped lang="less">
.editor-layout {
  background-color: #fff;
}
.left-wrapper {
  display: flex;
  align-items: center;
  :deep(.shadow-bg-wrapper) {
    margin-right: 10px;
    background-color: #cccccc36;
    .anticon{
      color: #6e6c6c;
    }
  }
}
</style>
