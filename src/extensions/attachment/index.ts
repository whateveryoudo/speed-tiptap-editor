/*
 * @Author: ykx
 * @Date: 2022-12-05 15:15:10
 * @LastEditTime: 2022-12-28 10:42:29
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\attachment\index.ts
 */
import { mergeAttributes, Node } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import Wrapper from './Wrapper.vue';
import { getDatasetAttribute } from '@/prose-utils';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    attachment: {
      setAttachment: (attrs?: any) => ReturnType;
    };
  }
}

export const Attachment = Node.create({
  name: 'attachment',
  content: '',
  marks: '',
  group: 'block',
  selectable: true,
  atom: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'attachment',
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[class=attachment]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addAttributes() {
    return {
      fileName: {
        default: null,
        parseHTML: getDatasetAttribute('filename'),
      },
      fileSize: {
        default: null,
        parseHTML: getDatasetAttribute('filesize'),
      },
      fileType: {
        default: null,
        parseHTML: getDatasetAttribute('filetype'),
      },
      fileExt: {
        default: null,
        parseHTML: getDatasetAttribute('fileext'),
      },
      downLoadUrl: {
        default: null,
        parseHTML: getDatasetAttribute('downLoadUrl'),
      },
      previewUrl: {
        default: null,
        parseHTML: getDatasetAttribute('previewUrl'),
      },
      hasTrigger: {
        default: false,
        parseHTML: (element) => getDatasetAttribute('hastrigger')(element) === 'true',
      },
      error: {
        default: null,
        parseHTML: getDatasetAttribute('error'),
      },
    };
  },

  addCommands() {
    return {
      setAttachment:
        (attrs = {}) =>
        ({ chain }) => {
          return chain().insertContent({ type: this.name, attrs }).run();
        },
    };
  },

  addNodeView() {
    return VueNodeViewRenderer(Wrapper);
  },
});
