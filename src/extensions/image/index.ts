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
import ImageWrapper from "./Wrapper.vue";

const resolveImageEl = (element: HTMLElement) =>
  element.nodeName === "IMG" ? element : element.querySelector("img");

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    iamge: {
      uploadImage: (files: any, pos?: number) => ReturnType;
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

  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
        parseHTML: (element) => {
          const img: any = resolveImageEl(element);
          return img.dataset.src || img.getAttribute("src");
        },
      },
      alt: {
        default: null,
        parseHTML: (element) => {
          const img: any = resolveImageEl(element);

          return img.getAttribute("alt");
        },
      },
      file: {
        default: null
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

      error: {
        default: null,
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      uploadImage:
        (files: any) =>
        ({ chain }) => {
          // 转换为数组统一处理
          const fileList = files?.length ? files : [files];
          if (fileList.length === 0) return false; // 未选择文件则不处理东西
          
          // 创建图片节点数组
          const imageNodes = Array.from(fileList).map((file: any) => ({
            type: this.name,
            attrs: { src: "", file }
          }));
          
          // 批量插入图片节点
          return chain().insertContent(imageNodes).run();
        },
    };
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageWrapper as any);
  },
  
});
