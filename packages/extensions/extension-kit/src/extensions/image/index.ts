/*
 * @Author: ykx
 * @Date: 2022-11-14 15:03:18
 * @LastEditTime: 2022-12-30 17:42:16
 * @LastEditors: your name
 * @Description:
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\image\index.ts
 */
import { Image as BuiltInImage } from "@tiptap/extension-image";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import { mergeAttributes } from "@tiptap/core";
import ImageWrapper from "./Wrapper.vue";
import { v4 as uuidv4 } from "uuid";
const resolveImageEl = (element: HTMLElement) =>
  element.nodeName === "IMG" ? element : element.querySelector("img");

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageUpload: {
      uploadImage: (files: any, pos?: number) => ReturnType;
      getTempFile: (fileId: string) => ReturnType;
      removeTempFile: (fileId: string) => ReturnType;
    };
  }
}

export const Image = BuiltInImage.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      inline: true,
      content: "",
      marks: "",
      group: "inline",
      draggable: false,
      selectable: true,
      atom: true,
    };
  },
  addStorage() {
    // 存储传入的临时文件Map
    return {
      tempFileMap: new Map<string, File>(),
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      // 用于关联临时文件
      tempFileId: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: "auto",
      },
      height: {
        default: "auto",
      },
      // 百分比
      percent: {
        default: 100,
      },
      heightPercent: {
        default: 1,
      },
      // 是否锁定图片缩放比例
      equalProportion: {
        default: true,
      },
      originalWidth: {
        default: null,
      },
      originalHeight: {
        default: null,
      },
      error: {
        default: null,
      },
    };
  },
  renderHTML({ node }) {
    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, {
        // 标准属性
        src: node.attrs.src,
        alt: node.attrs.alt,
        title: node.attrs.title,
        width: node.attrs.width,
        height: node.attrs.height,
        // 自定义属性 - 使用 data-* 属性保存
        "data-original-width": node.attrs.originalWidth,
        "data-original-height": node.attrs.originalHeight,
        "data-percent": node.attrs.percent,
        "data-height-percent": node.attrs.heightPercent,
        "data-equal-proportion": node.attrs.equalProportion,
      }),
    ];
  },
  parseHTML() {
    return [
      {
        tag: "img[src]",
        getAttrs: (element) => {
          const img = resolveImageEl(element as HTMLElement);
          return {
            src: img?.getAttribute("src") || img?.dataset.src,
            alt: img?.getAttribute("alt"),
            title: img?.getAttribute("title"),
            width: img?.getAttribute("width"),
            height: img?.getAttribute("height"),
            originalWidth:
              img?.dataset.originalWidth ||
              img?.getAttribute("data-original-width"),
            originalHeight:
              img?.dataset.originalHeight ||
              img?.getAttribute("data-original-height"),
            percent: img?.dataset.percent || img?.getAttribute("data-percent"),
            heightPercent:
              img?.dataset.heightPercent ||
              img?.getAttribute("data-height-percent"),
            equalProportion:
              img?.dataset.equalProportion !== undefined
                ? img.dataset.equalProportion === "true"
                : true,
          };
        },
      },
    ];
  },

  addCommands() {
    return {
      ...this.parent?.(),
      uploadImage:
        (files: any) =>
        ({ chain, editor }) => {
          // 转换为数组统一处理
          const fileList = files?.length ? files : [files];
          if (fileList.length === 0) return false; // 未选择文件则不处理东西
          const imageNodes: any[] = []; // 图片数组
          // 循环fileList，将文件添加到临时文件存储Map
          Array.from(fileList).forEach((file: any) => {
            const tempFileId = `temp-file-${uuidv4()}`;
            editor.storage.image.tempFileMap.set(tempFileId, file);
            imageNodes.push({
              type: this.name,
              attrs: { src: "", tempFileId },
            });
          });
          // 批量插入图片节点
          return chain().insertContent(imageNodes).run();
        },
      removeTempFile:
        (tempFileId: string) =>
        ({ editor }) => {
          editor.storage.image.tempFileMap.delete(tempFileId);
          return false;
        },
    };
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageWrapper as any);
  },
});
