<!--
 * @Author: ykx
 * @Date: 2022-11-22 18:43:56
 * @LastEditTime: 2022-12-21 17:25:49
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\mind\Wrapper.vue
-->
<template>
  <NodeViewWrapper class="node-mind" contenteditable="false">
    <base-plugin-box :width="nodeAttrs.width || maxWidth" :height="nodeAttrs.height" :maxWidth="maxWidth"
      :mind="mindInstance"  title="思维导图" iconRender="icon-kl-mind-map"
      :isEditable="isEditable" @triggerChangeEnd="handleResize">
      <div ref="mindEditorRef" style="height: 100%; maxheight: 100%; overflow: hidden"></div>
    </base-plugin-box>
  </NodeViewWrapper>
</template>
<script lang="ts" setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import BasePluginBox from '@/components/wrappers/BasePluginBox.vue'
// import useMind from '@/editor/collaboration/extendModals/mindModal/useMind'
import {
  getEditorContainerDOMSize,
} from '@/prose-utils'

const props = defineProps(nodeViewProps)
const loading = ref(false)
const mindInstance = ref()
const mindEditorRef = ref(null)
// torefs无效？？
const nodeAttrs = computed(() => {
  return props.node?.attrs
})
const isEditable = computed(() => {
  return props.editor?.isEditable
})
console.log(props.editor)
const maxWidth = getEditorContainerDOMSize(props.editor)?.width
// const { handleRender } = useMind()
const handleResize = (size: any) => {
  props.updateAttributes({ height: size.height, width: size.width })
  setTimeout(() => {
    // mindInstance.value &&  
    //   mindInstance.value.execCommand('camera');
    // 居中操作
    mindInstance.value._eventCallbacks?.resize[0].call(mindInstance.value);
  })
}
onMounted(async () => {
  await nextTick()
  // if (window.kityminder && window.kityminder?.Editor) {
  //   mindInstance.value = handleRender(nodeAttrs.value?.data, mindEditorRef, false)
  // }
})
watch(
  () => nodeAttrs.value.data,
  (val: any) => {
    const mind = mindInstance.value
    if (!mind) return
    mind.importJson(val)
  },
)
</script>

<style lang="less" scoped>
.custome-mind-map {
  border: 2px solid transparent;
  margin-top: 16px;
  min-height: 400px;

  &.has-focus {
    border: 2px solid rgba(110, 116, 224, 0.16);
    border-radius: 3px;
  }
}
</style>
