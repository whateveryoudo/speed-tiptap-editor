import type { Editor } from "@tiptap/core";
import { downloadFile } from "./fileDownload";
import { type ExportSuccessResult } from "./type";

export interface WordExportOptions {
  editor: Editor;
  fileName?: string;
  title: string;
  onProgress?: (progress: number) => void;
  onSuccess?: (result: ExportSuccessResult) => void;
  onError?: (error: Error) => void;
}

/**
 * 导出 Word 文档
 * 将编辑器内容转换为 HTML 并保存为 .docx 文件
 */
export async function exportWordDocument({
  editor,
  title,
  fileName = "document.docx",
  onProgress,
  onSuccess,
  onError,
}: WordExportOptions) {
  try {
    onProgress?.(10);

    // 获取编辑器内容
    const html = editor.getHTML();
    onProgress?.(30);
    // ✅ 动态 import，避免静态分析
    const { default: HTMLtoDOCX } = await import("html-to-docx");
    // 使用 html-to-docx 转换为真正的 DOCX 格式
    const docxBuffer = await HTMLtoDOCX(html, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
      font: "Calibri",
      fontSize: 22,
      title, // title没效果？？
    });
    onProgress?.(70);

    // 创建 Blob 对象
    const blob = new Blob([docxBuffer], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    // 下载文件
    downloadFile(blob, fileName);
    onProgress?.(100);
    onSuccess?.({
      value: docxBuffer,
      fileName,
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
  } catch (error) {
    console.error("Word 导出失败:", error);
    onError?.(error as Error);
  }
}

/**
 * 处理 Word 文档导出
 * 创建文件下载
 */
export function handleWordExport(
  editor: Editor,
  title: string,
  fileName?: string,
  onProgress?: (progress: number) => void,
  onSuccess?: (result: ExportSuccessResult) => void,
  onError?: (error: Error) => void
) {
  if (!editor) {
    return;
  }

  exportWordDocument({
    editor,
    title,
    fileName,
    onProgress,
    onSuccess,
    onError,
  });
}
