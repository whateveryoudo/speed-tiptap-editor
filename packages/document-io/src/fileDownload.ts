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

export function downloadTextFile(content: string, fileName: string, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType })
  downloadFile(blob, fileName)
}

export function downloadJsonFile(data: unknown, fileName: string) {
  const content = JSON.stringify(data, null, 2)
  downloadTextFile(content, fileName, 'application/json')
}

export function downloadHtmlFile(html: string, fileName: string) {
  downloadTextFile(html, fileName, 'text/html')
}
