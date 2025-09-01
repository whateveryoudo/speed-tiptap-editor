/*
 * @Author: ykx
 * @Date: 2022-12-05 15:15:10
 * @LastEditTime: 2022-12-28 10:42:29
 * @LastEditors: your name
 * @Description:
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\attachment\index.ts
 */
import { mergeAttributes, Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import Wrapper from "./Wrapper.vue";
import { getDatasetAttribute } from "@/prose-utils";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    attachment: {
      uploadAttachment: (files?: any) => ReturnType;
      downloadAttachment: (fileId?: string) => ReturnType;
      updateAttachmentAttributes: (attrs: Record<string, any>) => ReturnType;
    };
  }
}

export const Attachment = Node.create({
  name: "attachment",
  content: "",
  inline: true,
  marks: "",
  group: "inline",
  selectable: true,
  atom: true,
  draggable: false,

  addOptions() {
    return {
      HTMLAttributes: {
        class: "attachment",
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[class=attachment]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addAttributes() {
    return {
      displayMode: {
        default: "title",
        parseHTML: getDatasetAttribute("displayMode"),
      },
      file: {
        default: null
      },
      fileName: {
        default: null,
        parseHTML: getDatasetAttribute("filename"),
      },
      fileSize: {
        default: null,
        parseHTML: getDatasetAttribute("filesize"),
      },
      fileType: {
        default: null,
        parseHTML: getDatasetAttribute("filetype"),
      },
      fileId: {
        default: null,
        parseHTML: getDatasetAttribute("fileId"),
      }
    };
  },

  addCommands() {
    return {
      uploadAttachment:
        (files: any) =>
        ({ editor, tr }) => {
          debugger;
          // 转换为数组统一处理
          const fileList = files?.length ? files : [files];

          // 为每个文件创建一个附件节点
          Array.from(fileList).forEach((file) => {
            // 插入空的图片节点
            // const node = this.type.create({
            //   fileName: file.name,
            //   fileSize: file.size,
            //   fileType: file.type,
            //   fileExt: file.name.split('.').pop()
            // });
            const node = this.type.create({ fileId: "", file });
            const pos = tr.selection.from;
            tr.insert(pos, node);
          });

          return true;
        },
  
      downloadAttachment:
        (fileId?: string) =>
        () => {
          if (fileId) {
            Wrapper.value?.handleDownloadFile(fileId);
          }
          return true;
        },
    };
  },

  addNodeView() {
    return VueNodeViewRenderer(Wrapper as any);
  },
});
