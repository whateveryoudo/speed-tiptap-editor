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
      uploadImage: (arg: { width?: number | string }) => ReturnType;
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
      // 如何指定类型？？
        (files: any) =>
        ({ editor, tr }) => {
          // 转换为数组统一处理
          const fileList = files?.length ? files : [files];

          // 为每个文件创建一个图片节点
          Array.from(fileList).forEach((file) => {
            // 插入空的图片节点
            // const node = this.type.create({
            //   fileName: file.name,
            //   fileSize: file.size,
            //   fileType: file.type,
            //   fileExt: file.name.split('.').pop()
            // });
            const node = this.type.create({ src: "", file });
            const pos = tr.selection.from;
            tr.insert(pos, node);
          });

          return true;
        },
    };
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageWrapper as any);
  },
  
});
