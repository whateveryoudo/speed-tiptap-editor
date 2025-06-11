<template>
  <div class="h-full mr-4">
    <a-dropdown :trigger="['click']" placement="bottom">
      <a-button type="primary" size="small">
        <template #icon>
          <caret-down-outlined />
        </template>
      </a-button>
      <template #overlay>
        <a-menu @click="onClick">
          <a-menu-item :key="item.id" v-for="item in orgListStore.personList" >
            <div 
             
              :key="item.id" 
              class="org-list" 
              @click="toKnowledge(item)"
            >
              <a-avatar 
                class="avatar" 
                size="small"
              >
                <template #icon>
                  <AntDesignOutlined />
                </template>
              </a-avatar>
              <span class="ml-3">{{ item.name }}</span>
            </div>
          </a-menu-item>
          <a-menu-divider />
          <!-- <a-menu-item key="1">
            <div class="flex align-center">
              <a-avatar class="avatar" size="small">
                <template #icon>
                  <appstore-outlined />
                </template>
              </a-avatar>
              <span class="ml-3">切换组织</span>
            </div>
          </a-menu-item> -->
          <a-menu-item key="2">
            <div class="flex align-center">
              <a-avatar class="avatar" size="small">
                <template #icon>
                  <appstore-add-outlined />
                </template>
              </a-avatar>
              <span class="ml-3">新建组织</span>
            </div>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import useOrgListStore from '@/hooks/useOrgListStore'
import type { OrgListItem } from '@/hooks/useOrgListStore'
const orgListStore = useOrgListStore()
orgListStore.getPersonList()

defineProps({
  isHome: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()
const onClick = ({ key }: { key:string }) => {
  if (key === '2') {
    router.push('/create-organization')
  }
}

const toKnowledge = (item: OrgListItem) => {
  router.push(`/knowledge-home/${item.id}`)
}
</script>

<style lang="less" scoped>
.org-list {
  width: 150px;
  height: 30px;
  display: flex;
  align-items: center;
}
.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
