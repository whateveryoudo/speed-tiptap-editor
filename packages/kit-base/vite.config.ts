import { fileURLToPath, URL } from 'node:url'
import { createVueLibConfig } from '../../tools/vite.lib'

export default createVueLibConfig(
  fileURLToPath(new URL('.', import.meta.url)),
  {
  resolve: {
    alias: {
      '@kb': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      external: [
        'vue',
        'ant-design-vue',
        '@ant-design/icons-vue',
        'lodash-es',
        /^@tiptap\//,
        '@floating-ui/dom',
        '@microsoft/fetch-event-source',
        '@vueuse/core',
        '@speed-tiptap-editor/shared',
        '@speed-tiptap-editor/composables',
        '@speed-tiptap-editor/document-io',
        'speed-components-ui/components',
        'speed-components-ui/hooks',
      ],
    },
  },
  },
  { unocss: true },
)
