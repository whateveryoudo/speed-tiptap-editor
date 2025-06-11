<script lang="ts" setup>
import useDocShareStore from '@/hooks/useDocShareStore'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

const docShareStore = useDocShareStore()

const emits = defineEmits(['change'])
const props = defineProps<{ status: 'public' | 'private' }>()

const clickHandler = async () => {
  await docShareStore.share(props.status)
  emits('change')
}
</script>

<template>
  <a-modal v-model:visible="docShareStore.visible" :footer="null" title="分享文档">
    <div class="w-96 mx-auto">
      <img class="w-full" src="@/assets/image/engineering_team.svg" alt="team" />
    </div>

    <div class="mt-5 text-center">
      <div class="flex h-15 items-center justify-center" v-if="status === 'private'">
        <span class="text-gray-500"> 分享截止日期： </span>
        <a-space>
          <a-switch
            v-model:checked="docShareStore.checked"
            checked-children="长期"
            un-checked-children="" />

          <a-date-picker
            placeholder="选择分享截止日期"
            format="YYYY-MM-DD 23:59:59"
            class="w-52"
            :disabled-date="(current: Dayjs) => {
                return current && current < dayjs().endOf('day');
          }"
            v-model:value="docShareStore.expireDate"
            v-if="!docShareStore.checked" />
        </a-space>
      </div>

      <!-- <a-input-password placeholder="设置访问密码" v-model:value="docShareStore.password" /> -->

      <template v-else>
        <h3 class="font-bold text-xl text-icon-select cursor-text hover:bg-transparent">分享中</h3>
        <p class="mt-2 font-mono">
          {{ docShareStore.previewUrl }}
        </p>
      </template>
    </div>

    <div class="flex justify-center mt-10">
      <a-space>
        <a-button @click="docShareStore.visible = false" v-if="status === 'private'">取消</a-button>
        <a-button
          type="primary"
          :disabled="docShareStore.disabled"
          @click="clickHandler"
          :loading="docShareStore.loading">
          {{ status === 'private' ? '开启分享' : '取消分享' }}
        </a-button>
      </a-space>
    </div>
  </a-modal>
</template>
