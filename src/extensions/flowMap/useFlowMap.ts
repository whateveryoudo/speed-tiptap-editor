/*
 * @Author: ykx
 * @Date: 2022-11-23 16:00:36
 * @LastEditTime: 2022-12-21 17:45:38
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\flowMap\useFlowMap.ts
 */
import FlowMap from './FlowMap.vue'
import { readonly, ref, onMounted, type Ref } from 'vue'
import type { NodeViewProps } from '@tiptap/vue-3'
// @ts-ignore
import { renderXml, load } from './diagram/index.js'

export default (props: NodeViewProps, previewContainer: Ref<HTMLDivElement | undefined>) => {
  const dataSource = ref<string>(props.node.attrs.dataSource || '')
  const show = ref(false)
  const renderResult = ref('')

  onMounted(() => {
    load().catch(console.log)
  })

  return {
    FlowMap,
    renderResult: readonly(renderResult),
    show: readonly(show),
    dataSource,
    close() {
      show.value = false
    },
    open() {
      show.value = true
    },
    save(xml: string) {
      dataSource.value = xml
      props.updateAttributes({
        dataSource: xml,
      })

      if (previewContainer.value) {
        previewContainer.value.innerHTML = ''
      }
      const graph = renderXml(previewContainer.value, xml)
      graph.fit()
      graph.zoomTo(1)
      graph.center()
      return graph
    },
  }
}
