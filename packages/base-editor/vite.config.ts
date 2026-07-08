import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from '@unocss/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import nodePolyfills from 'vite-plugin-node-stdlib-browser'
import { defineConfig } from 'vite'

const dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    UnoCSS(),
    Components({
      resolvers: [AntDesignVueResolver({ importStyle: false, resolveIcons: true })],
      dts: false,
    }),
    nodePolyfills(),
  ],
  build: {
    lib: {
      entry: resolve(dirname, 'src/index.ts'),
      name: 'SpeedTiptapEditor',
      formats: ['es'],
      fileName: 'index',
    },
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
        'speed-components-ui/dist/style.css',
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
          if (assetInfo.name === 'style.css') return 'style.css'
          return assetInfo.name ?? 'asset'
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
})
