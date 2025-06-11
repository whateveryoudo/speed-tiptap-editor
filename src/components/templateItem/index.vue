<template>
  <div class="doc-wrapper">
    <div class="img-wrap">
      <div
        class="head w-full h-full bg-gray-400 bg-opacity-20 transition-all text-gray-500 flex justify-center items-center">
        <a-tooltip placement="bottom" title="预览模板">
          <eye-outlined @click="emit('triggerPrev')" class="mr-2 text-2xl" />
        </a-tooltip>
        <a-tooltip placement="bottom" title="编辑模板">
          <edit-outlined class="edit text-2xl" v-show="edit" @click="handleEditTpl(item.id)" />
        </a-tooltip>
        <a-tooltip placement="bottom" title="使用模板">
          <arrow-right-outlined  class="edit text-2xl ml-2" @click="emit('useTemplate')"/>
        </a-tooltip>
      </div>
      <!-- <img src="@/assets/image/file_bg.svg" alt="" /> -->
    </div>
    <div class="text">
      <div class="t">{{ item.title }}</div>
      <div class="sub">创建者：{{ item.createUser.name }}</div>
      <div class="sub">已使用：{{ item.usageAmount }}</div>
      <div class="sub">创建时间：{{ dayjs(item.createdAt).format('YYYY-MM-DD hh:mm:ss') }}</div>
    </div>
    <!-- <div class="f-button"><arrow-right-outlined style="color: #00b69b" /></div> -->
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  edit: {
    type: Boolean,
    defulat: false,
  },
})
const emit = defineEmits(['triggerPrev', 'useTemplate'])
const router = useRouter()
const handleEditTpl = (tplId: string) => {
  router.push(`/template-edit/${tplId}`)
}
</script>

<style lang="less" scoped>
.doc-wrapper {
  width: 200px;
  height: 230px;
  border: 1px solid #eee;
  align-items: center;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.2s linear;
  cursor: pointer;
  margin-right: 10px;
  margin-top: 10px;

  .img-wrap {
    overflow: hidden;
    position: relative;
    .head {
      position: absolute;
      // right: 10px;
      // top: 10px;
      // color: #333;
      opacity: 0;
      > span:hover {
        color: var(--ant-color-primary);
      }
    }
  }

  .f-button {
    // background-color: var(--ant-color-primary);
    width: 100%;
    height: 24px;
    text-align: right;
    padding: 0 10px;
    line-height: 24px;
  }

  img {
    width: 100%;
    // margin-left: -5px;
  }

  .text {
    width: 100%;
    padding: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    .t {
      font-size: 14px;
      font-weight: bold;
    }

    .sub {
      font-size: 12px;
      color: rgb(139, 139, 139);
      font-weight: lighter;
    }
  }
}

.doc-wrapper:hover {
  box-shadow: 0 6px 12px 0 rgba(123, 123, 123, 0.12);
  translate: 0 -4px;
  .head {
    opacity: 1;
  }
}
</style>
