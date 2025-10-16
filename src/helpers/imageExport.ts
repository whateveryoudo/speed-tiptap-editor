import type { Editor } from '@tiptap/core'
import { downloadFile } from './fileDownload'
import { type ExportSuccessResult } from './type'

export interface ImageExportOptions {
  editor: Editor
  fileName?: string
  title: string,
  format?: 'jpg' | 'png'
  quality?: number
  onProgress?: (progress: number) => void
  onSuccess?: (result: ExportSuccessResult) => void
  onError?: (error: Error) => void
}

/**
 * 导出图片
 * 将编辑器内容转换为图片格式
 */
export async function exportImageDocument({
  editor,
  title,
  fileName = 'document.jpg',
  onProgress,
  onSuccess,
  onError
}: ImageExportOptions) {
  try {
    onProgress?.(10)

    // 动态导入 html2canvas
    const html2canvas = (await import('html2canvas')).default
    
    onProgress?.(20)

    // 获取编辑器 DOM 元素
    const editorElement = editor.view.dom
    
    // 创建临时容器，添加导出时间
    const tempContainer = document.createElement('div')
    tempContainer.style.position = 'absolute'
    tempContainer.style.left = '-9999px'
    tempContainer.style.top = '-9999px'
    tempContainer.style.width = '800px' // 固定宽度
    tempContainer.style.backgroundColor = 'white'
    tempContainer.style.padding = '20px'
    tempContainer.style.fontFamily = 'Arial, sans-serif'
    
    // 克隆编辑器内容
    const clonedContent = editorElement.cloneNode(true) as HTMLElement
    
    // 创建标题和导出时间
    const titleElement = document.createElement('div')
    titleElement.style.fontSize = '24px'
    titleElement.style.fontWeight = 'bold'
    titleElement.style.marginBottom = '10px'
    titleElement.style.borderBottom = '2px solid #000'
    titleElement.style.paddingBottom = '10px'
    
    
    titleElement.textContent = title
    
    // 创建导出时间元素
    const timeElement = document.createElement('div')
    timeElement.style.fontSize = '12px'
    timeElement.style.color = '#666'
    timeElement.style.marginBottom = '20px'
    timeElement.style.fontStyle = 'italic'
    timeElement.textContent = `导出时间: ${new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })}`
    
    // 组装内容
    tempContainer.appendChild(titleElement)
    tempContainer.appendChild(timeElement)
    tempContainer.appendChild(clonedContent)
    
    // 添加到页面
    document.body.appendChild(tempContainer)
    
    onProgress?.(40)

    // 使用 html2canvas 截图
    const canvas = await html2canvas(tempContainer, {
      backgroundColor: '#ffffff',
      scale: 2, // 提高清晰度
      useCORS: true,
      allowTaint: true,
      width: 800,
      height: tempContainer.scrollHeight
    })
    
    onProgress?.(70)

    // 转换为图片
    const mimeType = 'image/jpeg'
    const dataURL = canvas.toDataURL(mimeType, 0.9) // 质量设置为0.9
    
    // 转换为 Blob
    const response = await fetch(dataURL)
    const blob = await response.blob()
    
    onProgress?.(90)

    // 清理临时元素
    document.body.removeChild(tempContainer)
    
    // 下载文件
    downloadFile(blob, fileName)
    
    onProgress?.(100)
    onSuccess?.({
      value:blob,
      fileName,
      type: mimeType
    })

  } catch (error) {
    console.error('图片导出失败:', error)
    onError?.(error as Error)
  }
}

/**
 * 处理图片导出
 * 创建文件下载
 */
export function handleImageExport(
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

  exportImageDocument({
    editor,
    title,
    fileName,
    onProgress,
    onSuccess,
    onError
  })
}
