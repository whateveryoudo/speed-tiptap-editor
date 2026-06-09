import type { Extensions } from '@tiptap/core'
import type { ToolBarConfig } from '@st/type'

export type EditorPresetName = 'lite' | 'knowledge'

export type BubbleMenuKey =
  | 'text'
  | 'tag'
  | 'image'
  | 'attachment'
  | 'table'
  | 'callout'
  | 'drag'

export interface EditorPresetFeatures {
  /** 是否包含标题节点 */
  hasTitle: boolean
  /** 是否启用拖拽句柄 */
  hasDragHandle: boolean
  /** 内容同步模式：html 走 v-model:content，json/collab 由外部或 Yjs 管理 */
  contentMode: 'html' | 'json'
  /** 是否展示文档检测浮层 */
  showDocumentSuggest: boolean
  /** 是否展示搜索替换弹框 */
  showSearchReplace: boolean
}

export interface EditorPreset {
  name: EditorPresetName
  getExtensions: (props: Record<string, any>) => Extensions
  toolbar: ToolBarConfig[]
  bubbleMenus: BubbleMenuKey[]
  features: EditorPresetFeatures
}
