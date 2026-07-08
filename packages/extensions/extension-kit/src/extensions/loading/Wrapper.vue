<!--
 * @Author: ykx
 * @Date: 2023-01-09 09:52:44
 * @LastEditTime: 2023-01-09 09:58:42
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\loading\Wrapper.vue
-->
<template>
  <NodeViewWrapper>
    <div class="loading-wrapper">
      <a-spin :tip="nodeAttrs.text ? `上传${nodeAttrs.text}中...` : ''"></a-spin>
    </div>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
const props = defineProps(nodeViewProps)
const nodeAttrs = computed(() => {
  return props.node?.attrs
})
</script>

<style scoped lang="less">
.loading-wrapper {
  display: 'flex';
  justify-content: 'center';
  padding: '1em';
  align-items: 'center';
  white-space: 'nowrap';
  text-align: 'center';
}
</style>
