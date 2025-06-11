/*
 * @Author: ykx
 * @Date: 2022-11-14 15:03:18
 * @LastEditTime: 2022-12-30 17:42:16
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\image\index.ts
 */
import { Image as BuiltInImage } from '@tiptap/extension-image';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import  ImageWrapper from './Wrapper.vue';

const resolveImageEl = (element: HTMLElement) => (element.nodeName === 'IMG' ? element : element.querySelector('img'));

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iamge: {
      setEmptyImage: (arg: { width?: number | string }) => ReturnType;
    };
  }
}

export const Image = BuiltInImage.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      inline: false,
      content: '',
      marks: '',
      group: 'block', 
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
          return img.dataset.src || img.getAttribute('src');
        },
      },
      alt: {
        default: null,
        parseHTML: (element) => {
          const img: any = resolveImageEl(element);

          return img.getAttribute('alt');
        },
      },
      title: {
        default: null,
      },
      width: {
        default: 'auto',
      },
      height: {
        default: 'auto',
      },
      hasTrigger: {
        default: false,
      },
      error: {
        default: null,
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setEmptyImage:
        (attrs = {}) =>
        ({ chain }) => {
          console.log(attrs);
          return chain().insertContent({ type: this.name, attrs }).run();
        },
    };
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageWrapper);
  }
});
