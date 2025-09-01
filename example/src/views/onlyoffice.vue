<template>
  <div class="onlyoffice-page">
    <a-space style="margin-bottom: 12px">
      <a-input v-model:value="fileId" placeholder="输入文件ID" style="width: 320px" />
      <a-button type="primary" @click="loadOnlyOffice">加载 OnlyOffice</a-button>
    </a-space>
    <div id="onlyoffice-container" ref="containerRef" class="flex-1"/>
  </div>
  
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue'
import { getOnlyofficeConfig } from '../api/attachement'

const containerRef = ref<HTMLDivElement>()
const fileId = ref('')
let docEditorInstance: any = null // 保存编辑器实例

const ONLYOFFICE_HOST = 'http://localhost:8080'

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = reject
    document.head.appendChild(s)
  })
}

async function loadOnlyOffice() {
  // 1. 销毁之前的编辑器实例
  if (docEditorInstance) {
    try {
      docEditorInstance.destroyEditor()
    } catch (e) {
      console.log('销毁编辑器实例失败:', e)
    }
    docEditorInstance = null
  }

  // 2. 从后端获取 OnlyOffice 的签名配置（后端已用 ONLYOFFICE_SECRET 生成 config.token）
  const { data } = await getOnlyofficeConfig({ fileId: fileId.value, mode: 'view' })
  const { config } = data || {}
  if (!config) return

  
  if (containerRef.value) containerRef.value.innerHTML = ''
  
  // 4. 创建新的编辑器实例并保存引用
  // @ts-ignore
  docEditorInstance = new DocsAPI.DocEditor('onlyoffice-container', config)
}
onBeforeMount(async () => {
  // 预先加载 DocsAPI 并创建编辑器（预览模式）
  await loadScript(`${ONLYOFFICE_HOST}/web-apps/apps/api/documents/api.js`)
})
onMounted(() => {
  // 可选：自动加载
  // loadOnlyOffice()
})
</script>

<style scoped>
.onlyoffice-page {
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
