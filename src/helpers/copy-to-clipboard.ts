/*
 * 强类型版复制工具：支持多格式复制（Rich Clipboard）
 * 为了与现有调用保持兼容，默认导出为 (text, onCopy?) => Promise<boolean>
 */
import { message } from 'ant-design-vue'

export type CopyItem = string | { text: string; format?: string }

function normalizeToPlainText(input: string | CopyItem[]): string {
  if (Array.isArray(input)) {
    // 优先使用 text/plain 格式
    const plainItem = input.find(i => typeof i === 'object' && i.format === 'text/plain')
    if (plainItem && typeof plainItem === 'object') {
      return plainItem.text
    }
    // 如果没有 text/plain，返回第一个文本内容
    const firstItem = input[0]
    return typeof firstItem === 'string' ? firstItem : firstItem.text
  }
  return String(input)
}

export const copy = async (
  text: string | CopyItem[],
  onCopy?: () => void,
): Promise<boolean> => {
  // 如果是多格式数组，使用 clipboardData.setData 支持多格式
  if (Array.isArray(text) && text.length > 0 && typeof text[0] === 'object') {
    try {
      let copySuccess = false;
      
      const copyHandler = (e: ClipboardEvent) => {
        if (!e.clipboardData) return;
        
        // 标准化数据格式
        const data: Array<{ format: string; text: string }> = [];
        
        text.forEach((item) => {
          if (typeof item === 'object') {
            data.push({
              format: item.format || 'text/plain',
              text: item.text || '',
            });
          }
        });
        
        // 设置多种格式到剪贴板
        data.forEach((item) => {
          e.clipboardData!.setData(item.format, item.text);
        });
        
        e.preventDefault();
        copySuccess = true;
        
        // 移除监听器
        document.removeEventListener('copy', copyHandler);
      };
      
      // 创建一个隐藏的可选中元素
      const span = document.createElement('span');
      span.textContent = normalizeToPlainText(text);
      span.style.all = 'unset';
      span.style.position = 'fixed';
      span.style.top = '0';
      span.style.clip = 'rect(0,0,0,0)';
      span.style.whiteSpace = 'pre';
      span.style.userSelect = 'text';
      document.body.appendChild(span);
      
      // 选中文本
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(span);
      selection?.removeAllRanges();
      selection?.addRange(range);
      
      // 添加 copy 事件监听器
      document.addEventListener('copy', copyHandler);
      
      // 执行复制命令
      const ok = document.execCommand('copy');
      
      // 清理
      selection?.removeAllRanges();
      document.body.removeChild(span);
      
      if (ok && copySuccess) {
        message.success('复制成功');
        onCopy && onCopy();
        return true;
      }
      
      // 如果失败，移除监听器
      document.removeEventListener('copy', copyHandler);
    } catch (e) {
      console.warn('Multi-format copy failed:', e);
    }
  }
  
  // 降级：纯文本复制
  const plain = normalizeToPlainText(text);

  // 优先使用现代 API（需 HTTPS/localhost 且用户手势触发）
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(plain);
      message.success('复制成功');
      onCopy && onCopy();
      return true;
    }
  } catch {
    // 忽略，回退到 execCommand
  }

  // 回退：使用隐藏节点 + 选区 + execCommand('copy')
  try {
    const span = document.createElement('span');
    span.textContent = plain;
    span.style.all = 'unset';
    span.style.position = 'fixed';
    span.style.top = '0';
    span.style.clip = 'rect(0,0,0,0)';
    span.style.whiteSpace = 'pre';
    span.style.userSelect = 'text';
    document.body.appendChild(span);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    const range = document.createRange();
    range.selectNodeContents(span);
    selection?.addRange(range);

    const ok = document.execCommand('copy');

    selection?.removeAllRanges();
    document.body.removeChild(span);
    message.success('复制成功');
    if (ok) onCopy && onCopy();
    return ok;
  } catch {
    return false;
  }
}