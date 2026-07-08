import mammoth from 'mammoth'
import type { Editor } from '@tiptap/core'
import { generateJSON } from '@tiptap/core'
export interface WordImportOptions {
  editor: Editor
  file: File
  onProgress?: (progress: number) => void
  onSuccess?: (json: Record<string, any>) => void
  onError?: (error: Error) => void
}
const HIGHLIGHT_COLOUR_NAMES = {
  yellow: "yellow",
  green: "green",
  cyan: "cyan",
  magenta: "magenta",
  blue: "blue",
  red: "red",
  darkBlue: "darkBlue", // 注意：虽然定义了，但默认 styleMap 可能不包含
  darkCyan: "darkCyan",
};
/**
 * 将 Word 文档转换为 HTML 并插入到编辑器中
 */
export async function importWordDocument({
  editor,
  file,
  onProgress,
  onSuccess,
  onError
}: WordImportOptions) {
  try {
    onProgress?.(10)
    
    // 读取文件内容
    const arrayBuffer = await file.arrayBuffer()
    onProgress?.(30)
    
    // 使用 mammoth 转换 Word 文档
    const result = await mammoth.convertToHtml(
      { arrayBuffer },
      {
        // 样式映射配置
        styleMap: [
          // 标题样式映射
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh", 
          "p[style-name='Heading 3'] => h3:fresh",
          "p[style-name='Heading 4'] => h4:fresh",
          "p[style-name='Heading 5'] => h5:fresh",
          "p[style-name='Heading 6'] => h6:fresh",
          
          // 列表样式映射
          "p[style-name='List Paragraph'] => ul > li:fresh",
          
          // 引用样式映射
          "p[style-name='Quote'] => blockquote:fresh",
          
          // 代码样式映射
          "p[style-name='Code'] => pre > code:fresh",
          // 动态样式映射 - 通过 transformDocument 更新的样式名称（这些是我自定义的）
          "p[style-name='Centered Text'] => p[style='text-align: center']:fresh",
          "p[style-name='Right Aligned'] => p[style='text-align: right']:fresh",
          "p[style-name='Justified Text'] => p[style='text-align: justify']:fresh",
          // 先不加背景高亮
        ],
        // 使用 transformDocument 动态更新样式名称
        transformDocument: (document: any) => {
          console.log('原始文档结构:', document);

          // 递归处理文档中的所有元素
          const processElement = (element: any) => {
            // 创建元素的副本，避免直接修改原对象
            const processedElement = { ...element }
            
            if (element.type === 'paragraph') {
              // 根据对齐方式动态更新样式名称
              if (element.alignment === 'center') {
                processedElement.styleName = 'Centered Text'
              } else if (element.alignment === 'right') {
                processedElement.styleName = 'Right Aligned'
              } else if (element.alignment === 'justify') {
                processedElement.styleName = 'Justified Text'
              }
            }
            
            // 递归处理子元素
            if (element.children && Array.isArray(element.children)) {
              processedElement.children = element.children.map(processElement)
            }
            
            return processedElement
          }
          
          const result = processElement(document)
          console.log('处理后的文档结构:', result)
          return result
        },
        
        // 转换选项
        convertImage: mammoth.images.imgElement((image) => {
          return image.read("base64").then((imageBuffer) => {
            return {
              src: `data:${image.contentType};base64,${imageBuffer}`
            }
          })
        }),
        
        // 忽略空段落
        ignoreEmptyParagraphs: true,
        
        // 保留样式
        includeEmbeddedStyleMap: true,
        includeDefaultStyleMap: true
      }
    )
    
    onProgress?.(70)
    
    // 处理转换结果
    if (result.messages.length > 0) {
      console.warn('Word 转换警告:', result.messages)
    }
    onProgress?.(90)
    console.log(result.value);
    // 将 HTML 插入到编辑器 (目前这里是全量doc,会将第一个元素作为title,没有将文件名作为title的逻辑，可能与语雀有些出入)
    const json = generateJSON(result.value, editor.extensionManager.extensions)
    editor.commands.setContent(json)
    
    onProgress?.(100)
    onSuccess?.(json)
    
  } catch (error) {
    console.error('Word 导入失败:', error)
    onError?.(error as Error)
  }
}

/**
 * 处理文件选择并导入 Word 文档
 */
export function handleWordFileSelect(
  editor: Editor,
  onFileChange?: (file: File) => void,
  onProgress?: (progress: number) => void,
  onSuccess?: (json: Record<string, any>) => void,
  onError?: (error: Error) => void
) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.docx,.doc'
  input.multiple = false
  
  input.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    onFileChange?.(file as File);
    if (file) {
      importWordDocument({
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
