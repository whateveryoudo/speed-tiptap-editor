// vite.config.mts
import { defineConfig, loadEnv } from "file:///Volumes/ykxDrive/gitee/speed-tiptap-editor/node_modules/.pnpm/vite@5.4.21_@types+node@20.19.25_less@4.4.2/node_modules/vite/dist/node/index.js";
import vue from "file:///Volumes/ykxDrive/gitee/speed-tiptap-editor/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vite@5.4.21_@types+node@20.19.25_less@4.4.2__vue@3.5.25_typescript@5.9.3_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///Volumes/ykxDrive/gitee/speed-tiptap-editor/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.2.0_vite@5.4.21_@types+node@20.19.25_less@4.4.2__vue@3.5.25_typescript@5.9.3_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { resolve } from "path";
import dts from "file:///Volumes/ykxDrive/gitee/speed-tiptap-editor/node_modules/.pnpm/unplugin-dts@1.0.0-beta.0_@microsoft+api-extractor@7.55.2_@types+node@20.19.25__esbuild@0.21._d32bh5jmuginxf237bgca5e4bq/node_modules/unplugin-dts/dist/vite.mjs";
import UnoCSS from "file:///Volumes/ykxDrive/gitee/speed-tiptap-editor/node_modules/.pnpm/@unocss+vite@0.58.9_rollup@4.53.3_vite@5.4.21_@types+node@20.19.25_less@4.4.2_/node_modules/@unocss/vite/dist/index.mjs";
import Components from "file:///Volumes/ykxDrive/gitee/speed-tiptap-editor/node_modules/.pnpm/unplugin-vue-components@28.8.0_@babel+parser@7.28.5_vue@3.5.25_typescript@5.9.3_/node_modules/unplugin-vue-components/dist/vite.js";
import { AntDesignVueResolver } from "file:///Volumes/ykxDrive/gitee/speed-tiptap-editor/node_modules/.pnpm/unplugin-vue-components@28.8.0_@babel+parser@7.28.5_vue@3.5.25_typescript@5.9.3_/node_modules/unplugin-vue-components/dist/resolvers.js";
import nodePolyfills from "file:///Volumes/ykxDrive/gitee/speed-tiptap-editor/node_modules/.pnpm/vite-plugin-node-stdlib-browser@0.2.1_node-stdlib-browser@1.3.1_rollup@4.53.3_vite@5.4.21_@ty_qtlspyaaftrjrm6ydyk5kmlsve/node_modules/vite-plugin-node-stdlib-browser/index.cjs";
var __vite_injected_original_dirname = "/Volumes/ykxDrive/gitee/speed-tiptap-editor";
var vite_config_default = defineConfig(({ command, mode }) => {
  const isLib = process.env.BUILD_MODE === "lib";
  const exampleEnv = loadEnv(mode, process.cwd() + "/example");
  console.log(exampleEnv.VITE_RELEASE_URL);
  return {
    root: isLib ? "." : "example",
    base: exampleEnv.VITE_RELEASE_URL,
    plugins: [
      vue(),
      vueJsx(),
      dts({
        tsconfigPath: "./tsconfig.json",
        processor: "vue",
        copyDtsFiles: true
      }),
      UnoCSS(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false,
            // 不使用自动导入样式
            resolveIcons: true
            // 自动解析图标
          })
        ],
        dts: "src/components.d.ts"
        // 生成类型声明文件
      }),
      nodePolyfills()
      // 用于处理html-to-docx 报错：https://github.com/privateOmega/html-to-docx/issues/128
    ],
    resolve: {
      alias: {
        "@st": resolve(__vite_injected_original_dirname, "src"),
        "@sc": resolve(__vite_injected_original_dirname, "../../../speed-components/src"),
        "#example": resolve(__vite_injected_original_dirname, "example/src")
      }
    },
    build: isLib ? {
      lib: {
        entry: ["src/index.ts"],
        name: "SpeedTiptapEditor",
        fileName: (format, entryName) => `speed-tiptap-editor-${entryName}.${format}.js`
      },
      rollupOptions: {
        external: process.env.BUILD_MODE === "lib" ? ["vue", "ant-design-vue"] : [],
        output: {
          globals: {
            vue: "Vue",
            "ant-design-vue": "AntDesignVue"
          },
          dir: "dist",
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === "style.css") return "style.css";
            return assetInfo.name;
          }
        }
      }
    } : {
      outDir: "dist-example"
    },
    server: {
      port: 3003,
      proxy: {
        [exampleEnv.VITE_APP_BASE_URL]: {
          target: exampleEnv.VITE_APP_BASE_PROXY_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${exampleEnv.VITE_APP_BASE_URL}`), ""),
          configure: (proxy, options) => {
            proxy.on("proxyReq", (proxyReq, req, res) => {
              proxyReq.setHeader("Connection", "keep-alive");
            });
          },
          timeout: 3e4
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1ZvbHVtZXMveWt4RHJpdmUvZ2l0ZWUvc3BlZWQtdGlwdGFwLWVkaXRvclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1ZvbHVtZXMveWt4RHJpdmUvZ2l0ZWUvc3BlZWQtdGlwdGFwLWVkaXRvci92aXRlLmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1ZvbHVtZXMveWt4RHJpdmUvZ2l0ZWUvc3BlZWQtdGlwdGFwLWVkaXRvci92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XG5pbXBvcnQgdnVlSnN4IGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWUtanN4XCI7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCBkdHMgZnJvbSBcInVucGx1Z2luLWR0cy92aXRlXCI7XG5pbXBvcnQgVW5vQ1NTIGZyb20gXCJAdW5vY3NzL3ZpdGVcIjtcbmltcG9ydCBDb21wb25lbnRzIGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlXCI7XG5pbXBvcnQgeyBBbnREZXNpZ25WdWVSZXNvbHZlciB9IGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnNcIjtcbmltcG9ydCBub2RlUG9seWZpbGxzIGZyb20gJ3ZpdGUtcGx1Z2luLW5vZGUtc3RkbGliLWJyb3dzZXInO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQsIG1vZGUgfSkgPT4ge1xuICBjb25zdCBpc0xpYiA9IHByb2Nlc3MuZW52LkJVSUxEX01PREUgPT09IFwibGliXCI7XG4gIGNvbnN0IGV4YW1wbGVFbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkgKyBcIi9leGFtcGxlXCIpOyAvLyBleGFtcGxlXHU3Njg0XHU1M0Q4XHU5MUNGXG4gIGNvbnNvbGUubG9nKGV4YW1wbGVFbnYuVklURV9SRUxFQVNFX1VSTClcbiAgcmV0dXJuIHtcbiAgICByb290OiBpc0xpYiA/IFwiLlwiIDogXCJleGFtcGxlXCIsXG4gICAgYmFzZTogZXhhbXBsZUVudi5WSVRFX1JFTEVBU0VfVVJMLFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHZ1ZSgpLFxuICAgICAgdnVlSnN4KCksXG4gICAgICBkdHMoe1xuICAgICAgICB0c2NvbmZpZ1BhdGg6IFwiLi90c2NvbmZpZy5qc29uXCIsXG4gICAgICAgIHByb2Nlc3NvcjogXCJ2dWVcIixcbiAgICAgICAgY29weUR0c0ZpbGVzOiB0cnVlLFxuICAgICAgfSksXG4gICAgICBVbm9DU1MoKSxcbiAgICAgIENvbXBvbmVudHMoe1xuICAgICAgICByZXNvbHZlcnM6IFtcbiAgICAgICAgICBBbnREZXNpZ25WdWVSZXNvbHZlcih7XG4gICAgICAgICAgICBpbXBvcnRTdHlsZTogZmFsc2UsIC8vIFx1NEUwRFx1NEY3Rlx1NzUyOFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVx1NjgzN1x1NUYwRlxuICAgICAgICAgICAgcmVzb2x2ZUljb25zOiB0cnVlLCAvLyBcdTgxRUFcdTUyQThcdTg5RTNcdTY3OTBcdTU2RkVcdTY4MDdcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgICAgZHRzOiBcInNyYy9jb21wb25lbnRzLmQudHNcIiwgLy8gXHU3NTFGXHU2MjEwXHU3QzdCXHU1NzhCXHU1OEYwXHU2NjBFXHU2NTg3XHU0RUY2XG4gICAgICB9KSxcbiAgICAgIG5vZGVQb2x5ZmlsbHMoKSAvLyBcdTc1MjhcdTRFOEVcdTU5MDRcdTc0MDZodG1sLXRvLWRvY3ggXHU2MkE1XHU5NTE5XHVGRjFBaHR0cHM6Ly9naXRodWIuY29tL3ByaXZhdGVPbWVnYS9odG1sLXRvLWRvY3gvaXNzdWVzLzEyOFxuICAgIF0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgXCJAc3RcIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjXCIpLFxuICAgICAgICBcIkBzY1wiOiByZXNvbHZlKF9fZGlybmFtZSwgXCIuLi8uLi8uLi9zcGVlZC1jb21wb25lbnRzL3NyY1wiKSxcbiAgICAgICAgXCIjZXhhbXBsZVwiOiByZXNvbHZlKF9fZGlybmFtZSwgXCJleGFtcGxlL3NyY1wiKVxuICAgICAgfSxcbiAgICB9LFxuICAgIGJ1aWxkOiBpc0xpYlxuICAgICAgPyB7XG4gICAgICAgIGxpYjoge1xuICAgICAgICAgIGVudHJ5OiBbXCJzcmMvaW5kZXgudHNcIl0sXG4gICAgICAgICAgbmFtZTogXCJTcGVlZFRpcHRhcEVkaXRvclwiLFxuICAgICAgICAgIGZpbGVOYW1lOiAoZm9ybWF0LCBlbnRyeU5hbWUpID0+XG4gICAgICAgICAgICBgc3BlZWQtdGlwdGFwLWVkaXRvci0ke2VudHJ5TmFtZX0uJHtmb3JtYXR9LmpzYCxcbiAgICAgICAgfSxcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgIGV4dGVybmFsOlxuICAgICAgICAgICAgcHJvY2Vzcy5lbnYuQlVJTERfTU9ERSA9PT0gXCJsaWJcIiA/IFtcInZ1ZVwiLCBcImFudC1kZXNpZ24tdnVlXCJdIDogW10sXG4gICAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICBnbG9iYWxzOiB7XG4gICAgICAgICAgICAgIHZ1ZTogXCJWdWVcIixcbiAgICAgICAgICAgICAgJ2FudC1kZXNpZ24tdnVlJzogJ0FudERlc2lnblZ1ZSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaXI6IFwiZGlzdFwiLFxuICAgICAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm8pID0+IHtcbiAgICAgICAgICAgICAgaWYgKGFzc2V0SW5mby5uYW1lID09PSBcInN0eWxlLmNzc1wiKSByZXR1cm4gXCJzdHlsZS5jc3NcIjtcbiAgICAgICAgICAgICAgcmV0dXJuIGFzc2V0SW5mby5uYW1lO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgOiB7XG4gICAgICAgIG91dERpcjogXCJkaXN0LWV4YW1wbGVcIixcbiAgICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiAzMDAzLFxuICAgICAgcHJveHk6IHtcbiAgICAgICAgW2V4YW1wbGVFbnYuVklURV9BUFBfQkFTRV9VUkxdOiB7XG4gICAgICAgICAgdGFyZ2V0OiBleGFtcGxlRW52LlZJVEVfQVBQX0JBU0VfUFJPWFlfVVJMLFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT5cbiAgICAgICAgICAgIHBhdGgucmVwbGFjZShuZXcgUmVnRXhwKGBeJHtleGFtcGxlRW52LlZJVEVfQVBQX0JBU0VfVVJMfWApLCBcIlwiKSxcbiAgICAgICAgICBjb25maWd1cmU6IChwcm94eSwgb3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgcHJveHkub24oXCJwcm94eVJlcVwiLCAocHJveHlSZXEsIHJlcSwgcmVzKSA9PiB7XG4gICAgICAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcihcIkNvbm5lY3Rpb25cIiwgXCJrZWVwLWFsaXZlXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICB0aW1lb3V0OiAzMDAwMCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxVCxTQUFTLGNBQWMsZUFBZTtBQUMzVixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLFNBQVMsZUFBZTtB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
