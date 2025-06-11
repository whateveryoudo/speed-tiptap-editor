<!--
 * @Author: ykx
 * @Date: 2022-11-23 16:00:36
 * @LastEditTime: 2023-01-06 12:05:36
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\flowMap\CustomeFlowMap.vue
-->
<script lang="tsx" setup>
import { DeploymentUnitOutlined } from '@ant-design/icons-vue'
import { onMounted, ref, computed, watch } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import useFlowMap from './useFlowMap'
import { load } from './diagram/index.js'
import BasePluginBox from '@/components/wrappers/BasePluginBox.vue'
import {
  getEditorContainerDOMSize,
} from '@/prose-utils'

const flowMapRef = ref<HTMLDivElement>()

const props = defineProps(nodeViewProps)
const isEditable = computed(() => {
  return props.editor?.isEditable
})
const nodeAttrs = computed(() => {
  return props.node?.attrs
})
const maxWidth = getEditorContainerDOMSize(props.editor)?.width
const graph = ref()
const { save, FlowMap, dataSource, } = useFlowMap(props, flowMapRef)
const getIconRender = () => <DeploymentUnitOutlined />
onMounted(() => {
  if (flowMapRef.value) {
    load()
      .then(() => {
        // 初始化
        graph.value = save(dataSource.value)

        graph.value?.zoomTo(75 / 100);
      })
      .catch(console.log)
  }
})
watch(
  () => nodeAttrs.value.dataSource,
  (val: any) => {
    graph.value = save(val)
  },
)
</script>

<template>
  <NodeViewWrapper class="node-flow" contenteditable="false">
    <base-plugin-box defaultZoom="75" :width="nodeAttrs.width || maxWidth" :height="nodeAttrs.height" :maxWidth="maxWidth"
      pluginType="flow" :mind="graph" title="流程图" :iconRender="getIconRender" :isEditable="isEditable">
      <div style="height: 100%; maxheight: 100%; overflow: hidden" class="render-box">
        <div ref="flowMapRef"></div>
      </div>

    </base-plugin-box>
  </NodeViewWrapper>
</template>

<style lang="less" scoped>
.render-box {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
