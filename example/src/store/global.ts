import { defineStore } from 'pinia';
import { ref } from 'vue';


export const useGlobalStore = defineStore('global', () => {
  const openJwt = ref(false); // 是否开启登录jwt校验

  return {
    openJwt,
  };
}); 