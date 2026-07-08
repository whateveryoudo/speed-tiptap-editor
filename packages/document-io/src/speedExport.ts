import type { Editor } from '@tiptap/core'
import { downloadFile } from './fileDownload'
import { type ExportSuccessResult } from './types'
export interface SpeedExportOptions {
  editor: Editor
  fileName?: string
  title?: string
  author?: string
  onProgress?: (progress: number) => void
  onSuccess?: (result: ExportSuccessResult) => void
  onError?: (error: Error) => void
}

/**
 * 导出 Speed 专有格式文档
 * 创建类 HTML 格式的 .sd 文件
 */
export async function exportSpeedDocument({
  editor,
  title,
  fileName = 'document.sd',
  onProgress,
  onSuccess,
  onError
}: SpeedExportOptions) {
  try {
    onProgress?.(10)

    // 获取编辑器内容
    const html = editor.getHTML()
    onProgress?.(30)

    // 创建 Speed 文档格式（先不增加更新时间，作者）
    const speedDocument = `<!doctype speed>
<title>${title}</title>
<meta name="doc-version" content="1" />
<meta name="editor" content="Speed Tiptap Editor" />

${html}
`

    onProgress?.(70)

    // 创建 Blob 对象
    const blob = new Blob([speedDocument], { type: 'text/plain' })
    onProgress?.(90)

    // 下载文件
    downloadFile(blob, fileName)
    onProgress?.(100)
    onSuccess?.({
      value:speedDocument,
      fileName,
      type: 'text/plain'
    }) // 这里可以将结果存入当前对象中，下次直接下载

  } catch (error) {
    console.error('Speed 文档导出失败:', error)
    onError?.(error as Error)
  }
}

/**
 * 处理 Speed 文档导出
 * 创建文件下载
 */
export function handleSpeedExport(
  editor: Editor,
  fileName?: string,
  onProgress?: (progress: number) => void,
  onSuccess?: () => void,
  onError?: (error: Error) => void
) {
  if (!editor) {
    return
  }

  exportSpeedDocument({
    editor,
    fileName,
    onProgress,
    onSuccess,
    onError
  })
}
