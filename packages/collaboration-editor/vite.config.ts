import { fileURLToPath } from 'node:url'
import { createVueLibConfig } from '../../tools/vite.lib'

export default createVueLibConfig(fileURLToPath(new URL('.', import.meta.url)), {
  build: {
    rollupOptions: {
      external: [
        'vue',
        '@speed-tiptap-editor/base-editor',
        '@speed-tiptap-editor/shared',
        '@hocuspocus/provider',
        '@tiptap/core',
        '@tiptap/extension-collaboration',
        '@tiptap/extension-collaboration-caret',
        '@tiptap/pm',
        '@tiptap/y-tiptap',
        'yjs',
        'y-protocols',
        'lib0',
      ],
    },
  },
})
