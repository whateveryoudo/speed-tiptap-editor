import type { Editor } from '@tiptap/core'
import { markdownToJSON } from './markdown-to-json'

export interface MarkdownImportOptions {
    editor: Editor
    file: File
    onProgress?: (progress: number) => void
    onSuccess?: (json: any) => void
    onError?: (error: Error) => void
}

/**
 * 将 Markdown 文档转换为 JSON 并插入到编辑器中
 */
export async function importMarkdownDocument({
    editor,
    file,
    onProgress,
    onSuccess,
    onError
}: MarkdownImportOptions) {
    try {
        onProgress?.(10)

        // 读取文件内容
        const text = await file.text()
        onProgress?.(30)



        onProgress?.(90)

        // 将 HTML 转换为 Tiptap JSON(目前这里是全量doc,会将第一个元素作为title,没有将文件名作为title的逻辑，可能与语雀有些出入)
        const json = markdownToJSON(text, editor.extensionManager.extensions)
        editor.commands.setContent(json)
        onProgress?.(100)
        onSuccess?.(json)

    } catch (error) {
        console.error('Markdown 导入失败:', error)
        onError?.(error as Error)
    }
}

/**
 * 处理文件选择并导入 Markdown 文档
 */
export function handleMarkdownFileSelect(
    editor: Editor,
    onFileSelected?: (file: File) => void,
    onProgress?: (progress: number) => void,
    onSuccess?: (json: any) => void,
    onError?: (error: Error) => void
) {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.md,.markdown,.mark'
    input.multiple = false

    input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (file) {
            onFileSelected?.(file)
            importMarkdownDocument({
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
