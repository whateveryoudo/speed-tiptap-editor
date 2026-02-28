/*
 * @Author: ykx
 * @Date: 2022-11-30 10:29:24
 * @LastEditTime: 2022-11-30 17:22:40
 * @LastEditors: your name
 * @Description:
 * @FilePath: \we-knowledge-base\src\tiptap\editor\collaboration\editor.ts
 */
import type { CSSProperties, VNode } from "vue";
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
export interface IUploadConfig {
  transformFileItem?: (item: any) => any; // 单条数据转换
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
  theme?: "light" | "dark"; // 编辑器主题
  antdToken?: any; // antd的token配置
  editorStyle?: CSSProperties;
  headerStyle?: CSSProperties;
  mainStyle?: CSSProperties;
  hideBorder?: boolean;
  /**
   * 内容
   */
  content?: string;

  /**
   * 内容(json数据,这里不提供更新操作，仅提供设置操作，目前仅开启了协同模式下使用)
   */
  json?: string | null | Record<string, any>;

  /**
   * 标题
   */
  title?: string;
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
   * 协作配置
   */
  collaboration?: {
    documentId: string;
    url: string;
    token: string;
    user: {
      id: string;
      username: string;
      nickname?: string;
      avatar?: string;
      color?: string;
      [key: string]: any;
    }; // 一些用户信息(用于协作时显示用户名和颜色,不传入颜色下采用随机颜色)
  };
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
      header?: Record<string, any>;
      bodyParams?: (
        action: string,
        content: string,
        customPrompt: string
      ) => Record<string, any>;
    };
  };
  // 文档检测配置
  documentSuggestConfig?: {
    rules?: any[];
  };
  // 对SpeedComponents的一些配置(注意这里)
  sdComponentsConfig?: {
    apis?: {
      [key: string]: any;
    };
    transformRequestRes?: (res: any) => ResponseType; // 请求返回数据转换
  };
}
