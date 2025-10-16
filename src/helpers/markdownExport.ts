import type { Editor } from '@tiptap/core'
import { downloadFile } from './fileDownload'
import TurndownService from 'turndown'
import { type ExportSuccessResult } from './type'

export interface MarkdownExportOptions {
  editor: Editor
  title: string,
  fileName?: string
  onProgress?: (progress: number) => void
  onSuccess?: (result: ExportSuccessResult) => void
  onError?: (error: Error) => void
}

/**
 * 导出 Markdown 文档
 * 将编辑器内容转换为 Markdown 格式并保存为 .md 文件
 */
export async function exportMarkdownDocument({
  editor,
  title,
  fileName = 'document.md',
  onProgress,
  onSuccess,
  onError
}: MarkdownExportOptions) {
  try {
    onProgress?.(10)

    // 获取编辑器内容
    const html = editor.getHTML()
    onProgress?.(30)

    // 使用 TurndownService 进行专业的 HTML 到 Markdown 转换
    const turndownService = new TurndownService({
      headingStyle: 'atx', // 使用 # 风格的标题
      bulletListMarker: '-', // 使用 - 作为列表标记
      codeBlockStyle: 'fenced', // 使用 ``` 代码块
      emDelimiter: '*', // 使用 * 作为斜体
      strongDelimiter: '**', // 使用 ** 作为加粗
      linkStyle: 'inlined', // 使用 [text](url) 格式的链接
      linkReferenceStyle: 'full' // 使用完整的链接引用
    })

    // 添加自定义规则
    turndownService.addRule('strikethrough', {
      filter: ['del', 's'],
      replacement: function (content: string) {
        return '~~' + content + '~~'
      }
    })

    // 转换 HTML 到 Markdown
    const markdown = turndownService.turndown(html)

    onProgress?.(70)

    // 创建 Blob 对象
    const blob = new Blob([markdown], { type: 'text/markdown' })
    onProgress?.(90)

    // 下载文件
    downloadFile(blob, fileName)
    onProgress?.(100)
    onSuccess?.({
      value:markdown,
      fileName,
      type: 'text/markdown'
    })

  } catch (error) {
    console.error('Markdown 导出失败:', error)
    onError?.(error as Error)
  }
}

/**
 * 处理 Markdown 文档导出
 * 创建文件下载
 */
export function handleMarkdownExport(
  editor: Editor,
  title: string,
  fileName?: string,
  onProgress?: (progress: number) => void,
  onSuccess?: (result: ExportSuccessResult) => void,
  onError?: (error: Error) => void
) {
  if (!editor) {
    return
  }

  exportMarkdownDocument({
    editor,
    title,
    fileName,
    onProgress,
    onSuccess,
    onError
  })
}
