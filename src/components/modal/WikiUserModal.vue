<template>
  <a-modal
    :visible="modelVisible"
    @cancel="emits('close')"
    title="用户管理"
    width="800px"
    :footer="null">
    <div class="mb-10">
      <a-alert message="权限说明" type="info" closable>
        <template #description>
          <div>权限继承：默认继承组织成员权限</div>
          <div>超级管理员：组织超级管理员和知识库创建者</div>
        </template>
      </a-alert>
      <div class="mt-4 text-right">
        <a-popover
          title="添加成员"
          trigger="click"
          placement="bottomLeft"
          :getPopupContainer="(triggerNode:any) => triggerNode.parentNode"
          v-model:visible="visible">
          <template #content>
            <a-spin :spinning="loading">
              <a-form class="w-96 flex" layout="inline">
                <a-form-item class="w-32" label="" v-bind="validateInfos.name">
                  <a-select
                    :dropdownStyle="{ 'z-index': 9999 }"
                    v-model:value="modelRef.authEnum"
                    :options="userRoleOptions"
                    :getPopupContainer="(triggerNode:any) => triggerNode.parentNode"
                    placeholder="成员权限"></a-select>
                </a-form-item>

                <a-form-item class="!mr-0 !mb-0 !flex-1" label="" v-bind="validateInfos.userName">
                  <a-input v-model:value="modelRef.userName" placeholder="输入对方用户名" />
                </a-form-item>
              </a-form>
            </a-spin>

            <footer class="flex justify-end mt-4">
              <a-space>
                <a-button @click="visibleToggle()" :disabled="loading">取消</a-button>
                <a-button @click="onInvite" type="primary" :disabled="loading" :loading="loading">
                  邀请对方
                </a-button>
              </a-space>
            </footer>
          </template>
          <a-button type="primary">添加用户</a-button>
        </a-popover>
      </div>

      <div class="t-4">
        <a-table
          :loading="wikiUsersStore.loading"
          :dataSource="wikiUsersStore.list"
          :columns="wikiUsersStore.columns"
          :pagination="false"
          bordered
          size="small">
          <template #bodyCell="{ column, index }">
            <template v-if="column.dataIndex === 'action'">
              <a-popover
                :title="`修改用户 “${wikiUsersStore.list[index].name}” 权限`"
                trigger="click"
                v-model:visible="wikiUsersStore.removeConfirmVisible[index]"
                :getPopupContainer="(triggerNode:any) => triggerNode.parentNode"
                placement="bottomLeft">
                <template #content>
                  <div class="w-72">
                    <a-select
                      class="w-full"
                      :options="userRoleOptions"
                      v-model:value="wikiUsersStore.tempRole[index]"
                      :getPopupContainer="(triggerNode:any) => triggerNode.parentNode"
                      placeholder="成员权限"></a-select>
                  </div>

                  <footer class="flex justify-end mt-4">
                    <a-space>
                      <a-button
                        type="default"
                        @click="wikiUsersStore.removeConfirmVisible[index] = false">
                        取消
                      </a-button>
                      <a-button type="primary" @click="wikiUsersStore.modifyUserRole(index)">
                        确定
                      </a-button>
                    </a-space>
                  </footer>
                </template>

                <a-button size="small" type="link">
                  <edit-outlined />
                </a-button>
              </a-popover>

              <a-popconfirm
                trigger="click"
                @confirm="wikiUsersStore.removeUser(index)"
                placement="bottomLeft">
                <template #title>
                  <div class="w-48">确定删除该用户吗？</div>
                </template>
                <a-button size="small" danger type="link">
                  <delete-outlined />
                </a-button>
              </a-popconfirm>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import useWikiUser from '@/hooks/useWikiUser'
import useWikiUsersStore from '@/hooks/useWikiUsersStore'

defineProps<{
  modelVisible: boolean
}>()

const emits = defineEmits(['close'])

const wikiUsersStore = useWikiUsersStore()

const { modelRef, validateInfos, loading, onInvite, userRoleOptions, visible, visibleToggle } =
  useWikiUser(() => {
    wikiUsersStore.getWikiUserList()
  })
</script>
