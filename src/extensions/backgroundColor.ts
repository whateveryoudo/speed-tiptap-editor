/*
 * @Author: ykx
 * @Date: 2022-11-18 19:25:05
 * @LastEditTime: 2022-11-18 19:25:06
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\background-color.ts
 */
import { Extension } from '@tiptap/core';

export type ColorOptions = {
  types: string[];
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    backgroundColor: {
      setBackgroundColor: (color: string) => ReturnType;
      unsetBackgroundColor: () => ReturnType;
    };
  }
}

export const BackgroundColor = Extension.create<ColorOptions>({
  name: 'backgroundColor',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          backgroundColor: {
            default: null,
            parseHTML: (element) => element.style.backgroundColor.replace(/['"]+/g, ''),
            renderHTML: (attributes) => {
              if (!attributes.backgroundColor) {
                return {};
              }

              return {
                style: `background-color: ${attributes.backgroundColor}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setBackgroundColor:
        (color) =>
        ({ chain }) => {
          return chain().setMark('textStyle', { backgroundColor: color }).run();
        },
      unsetBackgroundColor:
        () =>
        ({ chain }) => {
          return chain().setMark('textStyle', { backgroundColor: null }).removeEmptyTextStyle().run();
        },
    };
  },
});
