import { defineConfig } from "vitepress";
import { resolve } from "path";
import { fileURLToPath } from "url";
import UnoCSS from "unocss/vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// 环境变量配置
const VITE_APP_BASE_URL = process.env.VITE_APP_BASE_URL || "/api";
const VITE_APP_BASE_PROXY_URL =
  process.env.VITE_APP_BASE_PROXY_URL || "http://localhost:4000";

// 根据环境判断 base 路径
const base =
  process.env.NODE_ENV === "production" ? "/speed-components-ui/" : "/";

export default defineConfig({
  title: "Speed Tiptap Editor",
  description: "基于 Ant Design Vue + Tiptap 的富文本编辑器",
  base,
  themeConfig: {
    nav: [
      { text: "指南", link: "/guide/" },
      { text: "apis", link: "/apis/" },
      { text: "示例", link: "/demos/simple" },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "指南",
          items: [
            { text: "介绍", link: "/guide/" },
            { text: "快速开始", link: "/guide/quickstart" },
          ],
        },
      ],
      "/apis/": [
        {
          text: "插件",
          items: [
            {
              text: "Doc",
              link: "/apis/doc/index",
            },
          ],
        },
      ],
      "/demos/": [
        {
          text: "示例",
          items: [{ text: "基础", link: "/demos/simple" }],
        },
      ],
    },
  },
  vite: {
    resolve: {
      alias: {
        "@": resolve(__dirname, "../../src"),
      },
    },
    optimizeDeps: {
      include: ["ant-design-vue/es/locale/zh_CN", "@ant-design/icons-vue"],
    },
    ssr: {
      noExternal: ["ant-design-vue", "@ant-design/icons-vue"],
    },
    server: {
      port: 5174,
      proxy: {
        [VITE_APP_BASE_URL]: {
          target: VITE_APP_BASE_PROXY_URL,
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(new RegExp(`^${VITE_APP_BASE_URL}`), ""),
          configure: (proxy, options) => {
            proxy.on("proxyReq", (proxyReq, req, res) => {
              proxyReq.setHeader("Connection", "keep-alive");
            });
          },
          timeout: 30000,
        },
      },
    },
    plugins: [
      UnoCSS(),
      vueJsx(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false,
            resolveIcons: true,
          }),
        ]
      }),
    ],
  },
});
