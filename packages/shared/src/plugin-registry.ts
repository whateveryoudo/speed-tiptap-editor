import type { Component } from 'vue'
import type { ToolBarConfig } from './types/editor'
import type { BubbleMenuKey, SpeedEditorPlugin } from './types/preset'

export interface InsertMenuItem {
  key: string
  label: string
  /** Vue 组件，渲染在 Insert 下拉里 */
  component?: Component
  order?: number
}

export interface ToolbarRegistry {
  /** toolbar key → 按钮组件（接收 editor prop） */
  buttons: Record<string, Component>
  insertItems: InsertMenuItem[]
}

export interface BubbleMenuRegistry {
  menus: Partial<Record<BubbleMenuKey, Component[]>>
}

/** 从 plugins 合并 toolbar / bubble / insert / overlay 注册表 */
export function mergePluginRegistries(plugins: SpeedEditorPlugin[]): {
  toolbar: ToolbarRegistry
  bubble: BubbleMenuRegistry
  overlays: Component[]
  extensions: SpeedEditorPlugin['extensions'][]
} {
  const buttons: Record<string, Component> = {}
  const insertItems: InsertMenuItem[] = []
  const menus: Partial<Record<BubbleMenuKey, Component[]>> = {}
  const overlays: Component[] = []
  const extensions: SpeedEditorPlugin['extensions'][] = []

  for (const plugin of plugins) {
    if (plugin.extensions) {
      extensions.push(plugin.extensions)
    }
    if (plugin.toolbar) {
      for (const [key, comp] of Object.entries(plugin.toolbar)) {
        buttons[key] = comp as Component
      }
    }
    if (plugin.insertItems) {
      insertItems.push(...(plugin.insertItems as InsertMenuItem[]))
    }
    if (plugin.bubbleMenus) {
      for (const [key, comps] of Object.entries(plugin.bubbleMenus)) {
        const k = key as BubbleMenuKey
        menus[k] = [...(menus[k] ?? []), ...(comps as Component[])]
      }
    }
    if (plugin.overlays?.length) {
      overlays.push(...(plugin.overlays as Component[]))
    }
  }

  insertItems.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  return {
    toolbar: { buttons, insertItems },
    bubble: { menus },
    overlays,
    extensions,
  }
}

/** 解析 toolbarKeys，处理 `|` 分隔符（与现网 menus/index.tsx 一致） */
export function resolveToolbarLayout(toolbarKeys: ToolBarConfig[]) {
  const result: Array<{ key: string; showDivider: boolean }> = []

  for (let i = 0; i < toolbarKeys.length; i++) {
    const currentKey = toolbarKeys[i]
    const nextKey = toolbarKeys[i + 1]
    const currentKeyValue = typeof currentKey === 'string' ? currentKey : currentKey.key

    if (currentKeyValue === '|') continue

    const nextKeyValue =
      nextKey === undefined
        ? undefined
        : typeof nextKey === 'string'
          ? nextKey
          : nextKey.key

    result.push({
      key: currentKeyValue,
      showDivider: nextKeyValue === '|' && i + 1 < toolbarKeys.length,
    })
  }

  return result
}
