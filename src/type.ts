/*
 * @Author: ykx
 * @Date: 2022-11-30 10:29:24
 * @LastEditTime: 2022-11-30 17:22:40
 * @LastEditors: your name
 * @Description:
 * @FilePath: \we-knowledge-base\src\tiptap\editor\collaboration\editor.ts
 */
import type { VNode } from "vue";
import type { Editor } from "@tiptap/core";
export type ToolBarConfig =
  | string
  | {
    key: string;
    title: string;
    icon: string | VNode;
    options?: ToolBarConfig[];
  };
// 编辑器props
// 上传配置（image | file | upload）
interface IUploadConfig {
  multiple?: boolean;
  maxSize?: number; // 最大上传大小（单位：MB）
  accept?: string; // ,拼接的mime或文件扩展名（如：.svg,.png,.bmp,.jpg,.jpeg,.gif,.webp,.heic,推荐使用.xx，mime仅会在选择文件进行过滤）,mime参考：https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file#accept
  action?: string;
  headers?: Record<string, string>;
  data?: Record<string, any> | ((file: File) => Record<string, any>);
  beforeUpload?: (file: File, fileList: File[]) => boolean | Promise<boolean>;
  // 支持直接传入的ajax请求
  uploadApis?: {
    fileDownload: () => Promise<string>;
    fileUploadSingle: (file: File) => Promise<string>;
    fileUploadMulti: (files: File[]) => Promise<string[]>;
    fileDel: (fileId: string) => Promise<boolean>;
    getPreviewUrl: (fileId: string) => string;
  };
}
export interface CollaborationEditorProps {
  /**
   * 场景:
   */
  scene?: "default" | "knowledge";
  theme?: "light" | "dark"; // TODO
  /**
   * 内容
   */
  content?: string;
  /**
   * json
   */
  json?: any;
  /**
   * 文档 id
   */
  docId?: string;
  /**
   *  类型
   */
  docType?: "document" | "template";
  /**
   * 是否可编辑
   */
  editable?: boolean;

  /**
   * 是否需要菜单
   */
  menubar?: boolean;
  /**
   * 是否隐藏评论功能
   */
  hideComment?: boolean;
  /**
   * 占位符
   */
  placeholder?: string;
  hocuspocusProvider?: {
    type: Object;
  };

  toolbarKeys?: ToolBarConfig[];
  // 通用上传配置（此配置下会作用于image 和 file）
  upload?: IUploadConfig;
  // 图片
  image?: IUploadConfig;
  // 附件
  file?: IUploadConfig;
  fontSize?: {
    default?: string;
    options?: {
      value: string;
      label: string;
    }[];
  };
  // 文本浮动菜单
  textBubbleMenu?: {
    enabled?: boolean;
    items?: (
      | {
        icon: string | VNode;
        title: string;
        action?: (editor: Editor) => void;
      }
      | string
    )[];
  };
  // ai配置
  ai?: {
    doubao?: {
      url: string;
      header?: Record<string, any>
      bodyParams?: (action: string, content: string, customPrompt: string) => Record<string, any>
    }
  }
}
