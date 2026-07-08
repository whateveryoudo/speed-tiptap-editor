import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig, type UserConfig } from 'vite'

export function createVueLibConfig(dirname: string, overrides: UserConfig = {}): UserConfig {
  const { build: buildOverride, ...rest } = overrides

  return defineConfig({
    plugins: [vue(), vueJsx()],
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
          /^@speed-tiptap-editor\//,
          /^@tiptap\//,
          'ant-design-vue',
          'yjs',
          'y-protocols',
          'lib0',
          '@tiptap/y-tiptap',
          '@hocuspocus/provider',
        ],
        ...buildOverride?.rollupOptions,
      },
      sourcemap: true,
      emptyOutDir: true,
      ...buildOverride,
    },
    ...rest,
  })
}
