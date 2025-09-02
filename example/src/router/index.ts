import { createRouter, createWebHistory } from "vue-router";
import { speedTiptapLogin } from "../api/user";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../views/useage.vue"),
    },
    {
      path: "/onlyoffice",
      component: () => import("../views/onlyoffice.vue"),
    }
  ],
});

// 在每次路由切换前，确保存在 OnlyOffice token(这里不拦截路由访问)
router.beforeEach(async (_to, _from, next) => {
  const cacheKey = "speed-tiptap-token";
  let token = localStorage.getItem(cacheKey);

  if (!token) {
    try {
      // 这里写死了，目前没涉及到登录
      const { data } = await speedTiptapLogin({ username: "ykx", password: "123456" });
      token = (data && (data.token || data)) || "";
      if (token) {
        localStorage.setItem(cacheKey, token);
      }
    } catch (e) {
      // 忽略错误，正常放行，页面内再提示
    }
  }
  next();
});

export default router;