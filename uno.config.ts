import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'unocss'
import { unoSharedConfig } from './tools/uno.config'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

/** docs / demo 等根级场景：一次扫描所有用到 Uno 的子包 */
export default defineConfig({
  ...unoSharedConfig,
  content: {
    filesystem: [
      resolve(rootDir, 'packages/base-editor/src/**/*.{vue,ts,tsx}'),
      resolve(rootDir, 'packages/kit-base/src/**/*.{vue,ts,tsx}'),
      resolve(rootDir, 'packages/extensions/extension-kit/src/**/*.{vue,ts,tsx}'),
    ],
  },
})
