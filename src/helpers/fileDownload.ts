/**
 * 简单的文件下载工具
 * 避免依赖 file-saver 库
 */
export function downloadFile(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * 下载文本文件
 */
export function downloadTextFile(content: string, fileName: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType })
  downloadFile(blob, fileName)
}

/**
 * 下载 JSON 文件
 */
export function downloadJsonFile(data: any, fileName: string) {
  const content = JSON.stringify(data, null, 2)
  downloadTextFile(content, fileName, 'application/json')
}

/**
 * 下载 HTML 文件
 */
export function downloadHtmlFile(html: string, fileName: string) {
  downloadTextFile(html, fileName, 'text/html')
}
