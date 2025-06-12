<!--
 * @Author: ykx
 * @Date: 2022-11-11 15:39:52
 * @LastEditTime: 2022-11-23 15:33:22
 * @LastEditors: your name
 * @Description: 标题容器
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\title\wrapper.vue
-->
<template>
  <NodeViewWrapper class="title-wrapper">
    <!-- 预留封面功能 -->
    <NodeViewContent />
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
</script>

<style scoped lang="less">
.title-wrapper {
  position: relative;
  margin-top: 24px;

  .coverWrap {
    position: relative;
    height: 280px;
    margin-top: 14px;
    margin-bottom: 12px;
    overflow: hidden;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-position: center 50%;
      object-fit: cover;
    }

    .toolbar {
      position: absolute;
      right: 12px;
      bottom: 12px;
      z-index: 2;
      font-size: 1rem;
    }
  }

  .emptyToolbarWrap {
    position: absolute;
    top: 0;
    left: 0;
    height: 0;
    pointer-events: none;
  }
}
</style>
