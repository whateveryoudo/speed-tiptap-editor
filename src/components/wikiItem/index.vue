<template>
  <div
    class="item group"
    @click="toDetail(item.id)"
    :style="{ backgroundImage: `url(${item.avatar || '/images/cover2.png'})` }"
    style="background-size: 100% 140px">
    <div class="head flex justify-end items-center">
      <div class="star" :class="item.isStar ? '!opacity-100' : ''">
        <a-tooltip :title="!item.isStar ? '收藏' : '取消收藏'" placement="bottom">
          <span @click.stop="$emits('starWiki', item)">
            <a-rate class="!text-base" :value="item.isStar ? 1 : 0" :count="1" />
          </span>
        </a-tooltip>
      </div>
    </div>
    <div class="pt-28">
      <div class="font-bold inline-flex w-full justify-between hover:bg-white">
        <span class="flex-1">
          {{ item.name }}
        </span>

        <a-tooltip title="删除知识库" placement="bottom">
          <span @click.stop="handleDelete(item.id)" class="ml-2 !text-red-500">
            <delete-filled class="!text-base cursor-pointer invisible group-hover:visible" />
          </span>
        </a-tooltip>
        <a-tooltip title="编辑知识库" placement="bottom">
          <span @click.stop="handleEdit(item)" class="ml-2 !text-green-500" 
              v-if="userId == item.createUserId && route.name !== 'star'">
            <edit-outlined class="!text-base cursor-pointer invisible group-hover:visible" />
          </span>
        </a-tooltip>
      </div>
      <div class="text-xs text-gray-600">
        {{ item.description }}
      </div>
      <div class="flex text-xs text-gray-600 mt-2">
        <span> 创作者： </span>
        <span> {{ (item as any)?.createUser?.name }} </span>
      </div>
    </div>
    <div class="text-xs text-gray-600 mt-1">
      创建时间： {{ dayjs(item.createdAt).format('YYYY-MM-DD hh:mm:ss') }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { WikiListItem } from '@/hooks/useWikiListStore'
import { useRouter, useRoute } from 'vue-router'
import dayjs from 'dayjs'
import useWikiDelete from '@/hooks/useWikiDelete'
import { getStore } from '@/utils/storage'


const route = useRoute()
const router = useRouter()
const { deleteHandler } = useWikiDelete()
// 根据ID判断是否为创建者
const userId = JSON.parse(getStore('userInfo') as string)?.id

const toDetail = (id: string) => {
  router.push(`/document-preview/${route.params.org}/doc/${id}`)
}
const handleDelete = async (id: string) => {
  await deleteHandler(id)
  $emits('deleteWiki')
}
const handleEdit = (item:WikiListItem) => {
  $emits('editWiki', item)
  
}
defineProps<{
  item: WikiListItem
}>()
const $emits = defineEmits(['starWiki', 'deleteWiki', 'editWiki'])
</script>

<style lang="less" scoped>
.item {
  width: 214px;
  height: 216px;
  border: 1px solid #f1f1f1;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 5px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.2s linear;
  position: relative;
  cursor: pointer;
  float: left;
  // margin-left: 1%;
  margin-right: 10px;
  // color: #fff;
  background: url('@/assets/image/cover2.png') no-repeat;
  background-size: auto 140px;
  background-position: 0px -20px;
  .title {
    font-size: 14px;
    margin-top: 5px;
    margin-top: 85px;
  }
  .author {
    display: flex;
    align-items: center;
    // margin: 10px 0;
  }
  .time,
  .author {
    font-size: 10px;
    color: #5b5b5b;
  }
  .star {
    opacity: 0;
    margin-top: -5px;
  }
}
.item:hover {
  box-shadow: 0 6px 12px 0 rgba(123, 123, 123, 0.12);
  translate: 0 -4px;
  // transform: scale(1.01);
  .star {
    opacity: 1;
  }
}
.dark .item {
  background-color: #373737;
}
</style>
