<script lang="ts" setup>
import useDocExportStore from '@/hooks/useDocExportStore'

const docExportStore = useDocExportStore()
</script>

<template>
  <a-modal
    v-model:visible="docExportStore.visible"
    :footer="null"
    title="文档导出"
    :keyboard="!docExportStore.loading"
    :closable="!docExportStore.loading"
    :maskClosable="!docExportStore.loading">
    <a-spin :spinning="docExportStore.loading" tip="导出中...">
      <div class="w-full flex pb-5">
        <div
          class="w-1/4 p-3 rounded-3 flex flex-col border transition-shadow cursor-pointer border-solid border-transparent hover:border-gray-100 hover:shadow-md"
          :key="item.name"
          :class="
            item.disabled ? 'hover:border-transparent hover:shadow-none cursor-not-allowed' : ''
          "
          :style="
            item.disabled
              ? 'filter: grayscale(100%); filter: gray; color: #ccc; transition: none;'
              : ''
          "
          @click="item.disabled ? null : docExportStore.exportFile(item.suffix)"
          v-for="item in docExportStore.items">
          <img class="w-1/2 mx-auto" :src="item.icon" />
          <span class="text-center font-bold mt-2">{{ item.name }}</span>
          <span class="text-center">{{ item.suffix }}</span>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
