<template>
  <div class="logo cursor-pointer" @click="toHomePage">
    <!-- {{ title }} -->
    <web-logo />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { layoutSetting } from '@/config/globalSetting'
import { useAppStore } from '@/store'
import { useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const store = useAppStore()
    const collapsed = computed(() => {
      return store.collapsed
    })
    const router = useRouter()
    const title = layoutSetting.title
    return {
      toHomePage() {
        router.push('/workplace')
      },
      collapsed,
      title,
    }
  },
})
</script>

<style scoped lang="less">
.logo {
  height: 100%;
  margin: 0 10px;
  font-size: 26px;
  display: flex;
  font-weight: bold;
  align-items: center;
  min-width: 110px;
  color: #333;
  background: linear-gradient(45deg, #00b69b, #09009f 80%);
  text-shadow: 0 0 1em #fff;
  background-clip: text;
  color: transparent;
}
.dark .logo {
  color: #fff;
}
</style>
