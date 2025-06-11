<!--
 * @Description: 
 * @Autor: ykx
 * @Date: 2022-12-02 09:03:48
 * @LastEditors: your name
 * @LastEditTime: 2022-12-28 10:06:57
-->
<script lang="ts" setup>
// @ts-ignore
import { createEditor, load } from './diagram/index.js'
import { ref, watch, nextTick, PropType } from 'vue'
import { type Editor } from '@tiptap/core'
const diagramRef = ref<HTMLDivElement>()
let editorUi: any = null
const emit = defineEmits(['triggerData', 'update:visible'])
function handleSave() {
  if (editorUi) {
    const xml = editorUi.getXml();
    props?.editor.chain().focus().setFlowDataSource(xml).run();
    emit('update:visible', false)
    emit('triggerData', xml)
  }
}

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
  dataSource: {
    type: String,
    default: '',
  },
})
// watch(
//   () => props.dataSource,
//   dataSource => {
//     if (!editorUi) {
//       throw new Error('flow map editor instance is not exist.')
//     }
//     editorUi.setXml(dataSource)
//   },
// )
watch(
  () => props.visible,
  async (val: boolean) => {
    if (val) {
      await nextTick();
      if (diagramRef.value) {
        load()
          .then(() => {
            editorUi = createEditor(diagramRef.value)
            editorUi.setXml(props.dataSource)
          })
          .catch(console.log)
      }
    }
  },
)
</script>

<template>
  <s-draggable-modal destroyOnClose okText="保存" :canIchangeSize="false" fullscreen
    @cancel="emit('update:visible', false)" :visible="visible" @ok="handleSave" title="流程图">
    <main class="geEditor" ref="diagramRef"></main>
  </s-draggable-modal>
</template>

<style lang="less" scoped>

</style>
