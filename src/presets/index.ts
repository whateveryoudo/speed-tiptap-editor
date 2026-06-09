import { litePreset } from './lite'
import { knowledgePreset } from './knowledge'
import type { ToolBarConfig } from '@st/type'
import type {
  BubbleMenuKey,
  EditorPreset,
  EditorPresetName,
} from './types'

export * from './types'

const presetMap: Record<EditorPresetName, EditorPreset> = {
  lite: litePreset,
  knowledge: knowledgePreset,
}

export function resolveEditorPreset(preset: EditorPresetName = 'lite'): EditorPreset {
  return presetMap[preset]
}

export function resolveToolbarKeys(
  preset: EditorPreset,
  toolbarKeys?: ToolBarConfig[],
  excludeKeys?: string[],
): ToolBarConfig[] {
  if (toolbarKeys?.length) {
    return toolbarKeys
  }
  if (excludeKeys?.length) {
    return preset.toolbar.filter((key) => {
      const value = typeof key === 'string' ? key : key.key
      return !excludeKeys.includes(value)
    })
  }
  return preset.toolbar
}

export function resolveBubbleMenus(
  preset: EditorPreset,
  bubbleMenus?: BubbleMenuKey[],
): BubbleMenuKey[] {
  return bubbleMenus ?? preset.bubbleMenus
}

export { litePreset, knowledgePreset }
