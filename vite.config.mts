import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import dts from "unplugin-dts/vite";
import UnoCSS from "@unocss/vite";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isLib = process.env.BUILD_MODE === "lib";
  const exampleEnv = loadEnv(mode, process.cwd() + "/example"); // example的变量
  console.log(exampleEnv.VITE_RELEASE_URL)
  return {
    root: isLib ? "." : "example",
    base: exampleEnv.VITE_RELEASE_URL,
    plugins: [
      vue(),
      vueJsx(),
      dts({
        tsconfigPath: "./tsconfig.json",
        processor: "vue",
        copyDtsFiles: true,
      }),
      UnoCSS(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false, // 不使用自动导入样式
            resolveIcons: true, // 自动解析图标
          }),
        ],
        dts: "src/components.d.ts", // 生成类型声明文件
      }),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        "#example": resolve(__dirname, "example/src"),
      },
    },
    build: isLib
      ? {
        lib: {
          entry: ["src/index.ts"],
          name: "SpeedTiptapEditor",
          fileName: (format, entryName) =>
            `speed-tiptap-editor-${entryName}.${format}.js`,
        },
        rollupOptions: {
          external:
            process.env.BUILD_MODE === "lib" ? ["vue"] : [],
          output: {
            globals: {
              vue: "Vue",
            },
            dir: "dist",
            assetFileNames: (assetInfo) => {
              if (assetInfo.name === "style.css") return "style.css";
              return assetInfo.name;
            },
          },
        },
      }
      : {
        outDir: "dist-example",
      },
    server: {
      port: 3003,
      proxy: {
        [exampleEnv.VITE_APP_BASE_URL]: {
          target: exampleEnv.VITE_APP_BASE_PROXY_URL,
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(new RegExp(`^${exampleEnv.VITE_APP_BASE_URL}`), ""),
          configure: (proxy, options) => {
            proxy.on("proxyReq", (proxyReq, req, res) => {
              proxyReq.setHeader("Connection", "keep-alive");
            });
          },
          timeout: 30000,
        },
      },
    },
  };
});
