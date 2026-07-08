import type { Component } from 'vue'
import type { ToolBarConfig, CollaborationConfig } from './editor'

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
  hasTitle: boolean
  hasDragHandle: boolean
  contentMode: 'html' | 'json'
  showDocumentSuggest: boolean
  showSearchReplace: boolean
}

/** Tiptap Extension 占位，kit-base 内替换为真实类型 */
export type TiptapExtension = Record<string, unknown>

export interface EditorPreset {
  name: EditorPresetName | string
  getExtensions: (props: Record<string, unknown>) => TiptapExtension[]
  toolbar: ToolBarConfig[]
  bubbleMenus: BubbleMenuKey[]
  features: EditorPresetFeatures
}

/** base-editor 布局配置（由各 preset 包传入，base 不内置 lite/knowledge） */
export type EditorLayoutConfig = EditorPreset

export interface SpeedEditorPlugin {
  name: string
  extensions: TiptapExtension[] | ((ctx: Record<string, unknown>) => TiptapExtension[])
  /** toolbar 按钮 key → Vue 组件（与 preset.toolbar 里的 key 对应） */
  toolbar?: Record<string, unknown>
  bubbleMenus?: Partial<Record<BubbleMenuKey, unknown[]>>
  insertItems?: Array<{ key: string; label: string; component?: unknown; order?: number }>
  overlays?: Component[]
}

export type EditorFeatures = EditorPresetFeatures

export interface SpeedEditorProps {
  plugins?: SpeedEditorPlugin[]
  toolbarKeys?: ToolBarConfig[]
  bubbleMenus?: BubbleMenuKey[]
  features?: Partial<EditorFeatures>
  editable?: boolean
  content?: string
  json?: Record<string, unknown>
  placeholder?: string
}

export interface CollaborativeEditorProps extends SpeedEditorProps {
  collaborationConfig?: CollaborationConfig
}
