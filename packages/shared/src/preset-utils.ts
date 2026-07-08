import type { ToolBarConfig } from './types/editor'
import type { BubbleMenuKey, EditorPreset } from './types/preset'

export function resolveToolbarKeys(
  layout: EditorPreset,
  toolbarKeys?: ToolBarConfig[],
  excludeKeys?: string[],
): ToolBarConfig[] {
  if (toolbarKeys?.length) {
    return toolbarKeys
  }
  if (excludeKeys?.length) {
    return layout.toolbar.filter((key) => {
      const value = typeof key === 'string' ? key : key.key
      return !excludeKeys.includes(value)
    })
  }
  return layout.toolbar
}

export function resolveBubbleMenus(
  layout: EditorPreset,
  bubbleMenus?: BubbleMenuKey[],
): BubbleMenuKey[] {
  return bubbleMenus ?? layout.bubbleMenus
}
