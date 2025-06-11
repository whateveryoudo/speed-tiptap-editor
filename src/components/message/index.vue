<template>
  <div class="message-com">
    <a-tabs v-model:activeKey="activeKey" @change="handelChangetabs">
      <a-tab-pane key="unread" tab="未读">
        <div v-if="messageStore.unreadMessageList.length" class="message-list">
          <div v-for="item in messageStore.unreadMessageList" :key="item.id"  @click="messageStore.handeChangeRead(item.id, item.url)">
            <a-badge :dot="true">
              <span>{{ item.title }}</span>
            </a-badge>
          </div>
        </div>
        <a-empty v-else :image="Empty.PRESENTED_IMAGE_SIMPLE" />
      </a-tab-pane>
      <a-tab-pane key="read" tab="已读">
        <div v-if="messageStore.readMessageList.length" class="message-list">
          <div v-for="item in messageStore.readMessageList" :key="item.id">
            {{ item.title }}
          </div>
        </div>
        <a-empty v-else :image="Empty.PRESENTED_IMAGE_SIMPLE" />
      </a-tab-pane>
      <a-tab-pane key="all" tab="全部">
        <div v-if="messageStore.allMessageList.length" class="message-list">
          <div v-for="item in messageStore.allMessageList" :key="item.id">
            {{ item.title }}
          </div>
        </div>
        <a-empty v-else :image="Empty.PRESENTED_IMAGE_SIMPLE" />
      </a-tab-pane>
    </a-tabs>
    <div class="flex justify-center w-full" v-if="messageStore.total > page.size">
      <a-pagination
        v-model:current="page.page"
        :pageSize="page.size"
        simple
        :total="messageStore.total"
        @change="onPageChange" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import useMessageStore from '@/hooks/useMessageStore'
import type { pageParams } from '@/hooks/useMessageStore'

import { Empty } from 'ant-design-vue'
const messageStore = useMessageStore()
const page = ref<pageParams>({
  page: 1,
  size: 6,
})
const activeKey = ref('unread')

const onPageChange = (current: number) => {
  page.value.page = current
  switch (activeKey.value) {
    case 'unread':
      messageStore.getUnreadList(page.value)
      break
    case 'read':
      messageStore.getReadList(page.value)
      break
    case 'all':
      messageStore.getAllList(page.value)
      break
  }
}
const handelChangetabs = () => {
  page.value.page = 1
  page.value.size = 6
}
watch(
  () => activeKey.value,
  async key => {
    switch (key) {
      case 'unread':
        messageStore.getUnreadList(page.value)
        break
      case 'read':
        messageStore.getReadList(page.value)
        break
      case 'all':
        messageStore.getAllList(page.value)
        break
    }
  },
)
</script>

<style lang="less" scoped>
.message-com {
  width: 300px;
  .message-list {
    > div {
      line-height: 20px;
      padding: 5px;
      cursor: pointer;
      transition: all 0.2s;
    }
    > div:hover {
      background-color: var(--ant-color-primary)-opctiy-30;
    }
  }
}
</style>
