import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import UnoCSS from '@unocss/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'example',
  plugins: [
    vue(),
    vueJsx(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.d.ts', 'src/**/*.tsx', 'src/**/*.vue'],
    }),
    UnoCSS(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // 不使用自动导入样式
          resolveIcons: true, // 自动解析图标
        }),
      ],
      dts: 'src/components.d.ts', // 生成类型声明文件
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: ['src/main.ts'],
      fileName: (format, entryName) => `speed-tiptap-editor-${entryName}.${format}.js`,
      cssFileName: 'speed-tiptap-editor-style',
    },
    rollupOptions: {
      output: {
        dir: 'dist'
      },
    },
  },
  server: {
    port: 3000,
  },
})
