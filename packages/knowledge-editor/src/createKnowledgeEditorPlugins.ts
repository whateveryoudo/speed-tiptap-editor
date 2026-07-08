import { createKitBasePlugins } from '@speed-tiptap-editor/kit-base'
import { createSearchReplacePlugin } from '@speed-tiptap-editor/kit-base'
import { createMindPlugin } from '@speed-tiptap-editor/extension-mind'
import { createFlowPlugin } from '@speed-tiptap-editor/extension-flow'
import { createImportExportPlugin } from '@speed-tiptap-editor/extension-import-export'
import { createDocumentSuggestOverlayPlugin } from './createDocumentSuggestOverlay'
import type { SpeedEditorPlugin } from '@speed-tiptap-editor/shared'

export interface KnowledgeEditorPluginsOptions {
  /** 是否启用思维导图插件（需传入 adapter 后才有实际能力，见 extension-mind README） */
  mind?: boolean
  /** 是否启用流程图插件（占位，见 extension-flow README） */
  flow?: boolean
  /** 额外插件 */
  extraPlugins?: SpeedEditorPlugin[]
}

/** 文档预设默认插件集 */
export function createKnowledgeEditorPlugins(
  options: KnowledgeEditorPluginsOptions = {},
): SpeedEditorPlugin[] {
  const plugins: SpeedEditorPlugin[] = [
    ...createKitBasePlugins(),
    createImportExportPlugin(),
    createSearchReplacePlugin(),
    createDocumentSuggestOverlayPlugin(),
  ]
  if (options.mind) plugins.push(createMindPlugin())
  if (options.flow) plugins.push(createFlowPlugin())
  if (options.extraPlugins?.length) plugins.push(...options.extraPlugins)
  return plugins
}
