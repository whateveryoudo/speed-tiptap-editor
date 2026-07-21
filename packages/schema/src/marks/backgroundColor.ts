import { Extension } from '@tiptap/core'

export type BackgroundColorOptions = {
  types: string[]
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    backgroundColor: {
      setBackgroundColor: (color: string) => ReturnType
      unsetBackgroundColor: () => ReturnType
    }
  }
}

/**
 * textStyle 背景色属性（无 Vue）。commands 一并放 schema，kit 直接复用。
 */
export const BackgroundColor = Extension.create<BackgroundColorOptions>({
  name: 'backgroundColor',

  addOptions() {
    return {
      types: ['textStyle'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          backgroundColor: {
            default: null,
            parseHTML: (element) =>
              element.style.backgroundColor.replace(/['"]+/g, ''),
            renderHTML: (attributes) => {
              if (!attributes.backgroundColor) {
                return {}
              }
              return {
                style: `background-color: ${attributes.backgroundColor}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setBackgroundColor:
        (color) =>
        ({ chain }) => {
          return chain().setMark('textStyle', { backgroundColor: color }).run()
        },
      unsetBackgroundColor:
        () =>
        ({ chain }) => {
          return chain()
            .setMark('textStyle', { backgroundColor: null })
            .removeEmptyTextStyle()
            .run()
        },
    }
  },
})
