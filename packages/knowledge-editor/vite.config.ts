import { fileURLToPath } from 'node:url'
import { createVueLibConfig } from '../../tools/vite.lib'

export default createVueLibConfig(fileURLToPath(new URL('.', import.meta.url)), {
  build: {
    rollupOptions: {
      external: [
        'vue',
        '@speed-tiptap-editor/base-editor',
        '@speed-tiptap-editor/collaboration-editor',
        '@speed-tiptap-editor/shared',
        '@speed-tiptap-editor/kit-base',
        '@speed-tiptap-editor/extension-kit',
        /^@speed-tiptap-editor\/extension-/
      ],
    },
  },
})
