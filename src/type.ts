/*
 * @Author: ykx
 * @Date: 2022-11-30 10:29:24
 * @LastEditTime: 2022-11-30 17:22:40
 * @LastEditors: your name
 * @Description:
 * @FilePath: \we-knowledge-base\src\tiptap\editor\collaboration\editor.ts
 */
import type { CSSProperties, VNode } from 'vue'
import type { Editor } from '@tiptap/core'
import type { HocuspocusProvider } from '@hocuspocus/provider'
import type * as Y from 'yjs'
import type {
  BubbleMenuKey,
  EditorPresetName,
} from '@st/presets'
import type { CollaborationUser } from '@st/hooks/useCollaboration'

export type ToolBarConfig =
  | string
  | {
      key: string
      title: string
      icon: string | VNode
      options?: ToolBarConfig[]
    }

export interface UserInfo {
  id: number
  username: string
  nickname?: string
  avatar?: string
  color?: string
  [key: string]: any
}

export interface IUploadConfig {
  transformFileItem?: (item: any) => any
  multiple?: boolean
  maxSize?: number
  accept?: string
  action?: string
  headers?: Record<string, string>
  data?: Record<string, any> | ((file: File) => Record<string, any>)
  beforeUpload?: (file: File, fileList: File[]) => boolean | Promise<boolean>
  uploadApis?: {
    fileDownload: () => Promise<string>
    fileUploadSingle: (file: File) => Promise<string>
    fileUploadMulti: (files: File[]) => Promise<string[]>
    fileDel: (fileId: string) => Promise<boolean>
    getPreviewUrl: (fileId: string) => string
  }
}

export interface CollaborationEditorProps {
  preset?: EditorPresetName
  theme?: 'light' | 'dark'
  antdToken?: any
  editorStyle?: CSSProperties
  headerStyle?: CSSProperties
  mainStyle?: CSSProperties
  hideBorder?: boolean
  content?: string
  json?: string | null | Record<string, any>
  title?: string
  docId?: string
  docType?: 'document' | 'template'
  editable?: boolean
  ydoc?: Y.Doc | null
  provider?: HocuspocusProvider | null
  collaborationUser?: CollaborationUser | null
  menubar?: boolean
  hideComment?: boolean
  placeholder?: string
  toolbarKeys?: ToolBarConfig[]
  excludeKeys?: string[]
  bubbleMenus?: BubbleMenuKey[]
  upload?: IUploadConfig
  image?: IUploadConfig
  file?: IUploadConfig
  fontSize?: {
    default?: string
    options?: { value: string; label: string }[]
  }
  textBubbleMenu?: {
    enabled?: boolean
    items?: (
      | {
          icon: string | VNode
          title: string
          action?: (editor: Editor) => void
        }
      | string
    )[]
  }
  ai?: {
    doubao?: {
      url: string
      header?: Record<string, any>
      bodyParams?: (
        action: string,
        content: string,
        customPrompt: string,
      ) => Record<string, any>
    }
  }
  mentionUserFetch?: any
  documentSuggestConfig?: {
    rules?: any[]
  }
  sdComponentsConfig?: {
    apis?: {
      [key: string]: any
    }
    transformRequestRes?: (res: any) => ResponseType
  }
}
