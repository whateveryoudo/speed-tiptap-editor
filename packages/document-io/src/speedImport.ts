import type { Editor } from '@tiptap/core'
import { generateJSON } from '@tiptap/core'

export interface SpeedImportOptions {
  editor: Editor
  file: File
  onProgress?: (progress: number) => void
  onSuccess?: (json?: Record<string, unknown>) => void
  onError?: (error: Error) => void
}

/**
 * 解析 Speed 文档格式
 * 从 .sd 文件中提取 HTML 内容和 JSON 数据
 */
function parseSpeedDocument(content: string) {
  // 提取标题
  const titleMatch = content.match(/<title>(.*?)<\/title>/)
  const title = titleMatch?.[1] || '未命名文档'

  // 提取元数据
  // const createdAtMatch = content.match(/<meta name="created-at" content="(.*?)" \/>/)
  // const updatedAtMatch = content.match(/<meta name="updated-at" content="(.*?)" \/>/)
  // const authorMatch = content.match(/<meta name="author" content="(.*?)" \/>/)

  // 提取 HTML 内容（去掉元数据部分）
  const htmlContent = content.replace(/<!doctype speed>[\s\S]*?<meta[^>]*\/>\s*/, '')

  return {
    title,
    html: htmlContent,
    meta: {
      // createdAt: createdAtMatch?.[1] || '',
      // updatedAt: updatedAtMatch?.[1] || '',
      // author: authorMatch?.[1] || ''
    }
  }
}

/**
 * 导入 Speed 文档
 * 解析 .sd 文件并设置到编辑器
 */
export async function importSpeedDocument({
  editor,
  file,
  onProgress,
  onSuccess,
  onError
}: SpeedImportOptions) {
  try {
    onProgress?.(10)

    const text = await file.text()
    onProgress?.(30)

    // 解析 Speed 文档， 目前用不上title,因为第一个节点会被解析成title
    const { html } = parseSpeedDocument(text)
    onProgress?.(50)

    // 将 HTML 插入到编辑器
    const jsonResult = generateJSON(html, editor.extensionManager.extensions)
    editor.commands.setContent(jsonResult)

    onProgress?.(90)

    // 触发成功回调
    onSuccess?.(jsonResult as Record<string, unknown>)

    onProgress?.(100)

  } catch (error) {
    console.error('Speed 文档导入失败:', error)
    onError?.(error as Error)
  }
}

/**
 * 处理 Speed 文件选择
 * 创建文件选择器并处理 Speed 文档导入
 */
export function handleSpeedFileSelect(
  editor: Editor,
  onFileChange?: (file: File) => void,
  onProgress?: (progress: number) => void,
  onSuccess?: (json?: Record<string, unknown>) => void,
  onError?: (error: Error) => void
) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.sd,.speed'
  input.multiple = false

  input.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    onFileChange?.(file as File);
    if (file) {
      importSpeedDocument({
        editor,
        file,
        onProgress,
        onSuccess,
        onError
      })
    }
  }

  input.click()
}
