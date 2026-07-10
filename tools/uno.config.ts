import { resolve } from 'node:path'
import { defineConfig, presetUno, type UserConfig } from 'unocss'

export const unoSharedConfig = {
  presets: [presetUno()],
  rules: [
    [
      /^border-b-\[var\(--([^)]+)\)\]$/,
      ([, name]) => ({ 'border-bottom': `1px solid var(--${name})` }),
    ],
  ],
} satisfies Partial<UserConfig>

/** 单个子包 build 时使用，只扫描该包 src */
export function createPackageUnoConfig(packageDir: string) {
  return defineConfig({
    ...unoSharedConfig,
    content: {
      filesystem: [resolve(packageDir, 'src/**/*.{vue,ts,tsx}')],
    },
  })
}
