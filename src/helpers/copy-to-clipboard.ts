/*
 * 强类型版复制工具：优先使用 Clipboard API，失败时降级到 execCommand。(TODO:使用vueuse??)
 * 为了与现有调用保持兼容，默认导出为 (text, onCopy?) => Promise<boolean>
 */
import { message } from 'ant-design-vue'

export type CopyItem = string | { text: string; format?: string }

function normalizeToPlainText(input: string | CopyItem[]): string {
  if (Array.isArray(input)) {
    return input.map(i => (typeof i === 'string' ? i : i.text)).join('\n')
  }
  return String(input)
}

export const copy = async (
  text: string | CopyItem[],
  onCopy?: () => void,
): Promise<boolean> => {
  const plain = normalizeToPlainText(text)

  // 优先使用现代 API（需 HTTPS/localhost 且用户手势触发）
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(plain)
      message.success('复制成功')
      onCopy && onCopy()
      return true
    }
  } catch {
    // 忽略，回退到 execCommand
  }

  // 回退：使用隐藏节点 + 选区 + execCommand('copy')
  try {
    const span = document.createElement('span')
    span.textContent = plain
    span.style.all = 'unset'
    span.style.position = 'fixed'
    span.style.top = '0'
    span.style.clip = 'rect(0,0,0,0)'
    span.style.whiteSpace = 'pre'
    span.style.userSelect = 'text'
    document.body.appendChild(span)

    const selection = window.getSelection()
    selection?.removeAllRanges()
    const range = document.createRange()
    range.selectNodeContents(span)
    selection?.addRange(range)

    const ok = document.execCommand('copy')

    selection?.removeAllRanges()
    document.body.removeChild(span)
    message.success('复制成功')
    if (ok) onCopy && onCopy()
    return ok
  } catch {
    return false
  }
}