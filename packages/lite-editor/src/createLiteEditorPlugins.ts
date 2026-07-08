import { createKitBasePlugins } from '@speed-tiptap-editor/kit-base'
import type { SpeedEditorPlugin } from '@speed-tiptap-editor/shared'

/** 首页预设默认插件集（kit-base） */
export function createLiteEditorPlugins(): SpeedEditorPlugin[] {
  return createKitBasePlugins()
}
