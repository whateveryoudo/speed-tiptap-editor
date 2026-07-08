import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@ek': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'SpeedTiptapExtensionKit',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'vue',
        'ant-design-vue',
        '@ant-design/icons-vue',
        'lodash-es',
        'axios',
        /^@tiptap\//,
        /^@floating-ui\//,
        '@speed-tiptap-editor/shared',
        '@speed-tiptap-editor/composables',
        'speed-components-ui/components',
        'yjs',
        'y-protocols',
        'lib0',
        '@tiptap/y-tiptap',
        '@hocuspocus/provider',
      ],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
})
