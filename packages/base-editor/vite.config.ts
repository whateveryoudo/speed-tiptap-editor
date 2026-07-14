import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from '@unocss/vite'
import nodePolyfills from 'vite-plugin-node-stdlib-browser'
import { defineConfig } from 'vite'

const dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    UnoCSS(),
    nodePolyfills(),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(dirname, 'src/index.ts'),
        style: resolve(dirname, 'src/style.ts'),
        plugin: resolve(dirname, 'src/plugin-entry.ts'),
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        'vue',
        'ant-design-vue',
        '@speed-tiptap-editor/shared',
        '@speed-tiptap-editor/composables',
        '@speed-tiptap-editor/ui',
        'speed-components-ui',
        'speed-components-ui/components',
        'speed-components-ui/hooks',
        '@vueuse/core',
        'lodash-es',
        'viewerjs',
        /^@tiptap\//,
      ],
      output: {
        globals: {
          vue: 'Vue',
          'ant-design-vue': 'AntDesignVue',
          yjs: 'Y',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) return 'style.css'
          return assetInfo.name ?? 'asset'
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
})
