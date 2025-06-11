<!--
 * @Author: ykx
 * @Date: 2022-12-06 20:37:12
 * @LastEditTime: 2023-01-09 16:31:23
 * @LastEditors: your name
 * @Description: 模板预览
 * @FilePath: \we-knowledge-base\src\components\tplPreviewModal\index.vue
-->
<template>
  <s-draggable-modal
    :canIchangeSize="false"
    fullscreen
    @cancel="emit('update:visible', false)"
    :visible="visible"
    :footer="null">
    <template #title>
      <div class="flex justify-between pr-[50px] items-center">
        模板预览
        <a-button :loading="loading" type="primary" @click="useTpl">使用该模板</a-button>
      </div>
    </template>
    <CollaborationEditor :editable="false" :menubar="false" :doc-id="docId" doc-type="template" />
  </s-draggable-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CollaborationEditor } from '@/tiptap/editor'
import useDocCreate from '@/hooks/useDocCreate'
import { useRouter } from 'vue-router'
import useDocListStore from '@/hooks/useDocListStore'
import { message } from 'ant-design-vue'
import useRouteParams from '@/hooks/useRouteParams'
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  docId: {
    type: String,
    default: '',
  },
  pId: {
    type: String,
    default: '',
  },
})
const { organizationId } = useRouteParams();
const emit = defineEmits(['update:visible'])
const loading = ref(false)
const { docCreateHandler } = useDocCreate()
const docListStore = useDocListStore()
const router = useRouter()
const useTpl = async () => {
  // 走模板新建
  loading.value = true;
  const id = (await docCreateHandler(props.docId, false, props.pId)) as any
  if (!id) {
    message.error('生成文档失败...')
    loading.value = false;
    return
  }
  await docListStore.getAllDocs()
  loading.value = false;
  router.push(`/document-edit/${organizationId.value}/${id}`)
}
</script>

<style scoped lang="less"></style>
