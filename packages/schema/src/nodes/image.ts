import { Image as TiptapImage } from '@tiptap/extension-image'
import { mergeAttributes } from '@tiptap/core'

const resolveImageEl = (element: HTMLElement) =>
  element.nodeName === 'IMG' ? element : element.querySelector('img')

/**
 * 无 UI 图片节点：从原 extension Image 抽离（去掉 NodeView / 上传命令）。
 * 编辑器侧在 extension-kit 中 extend 补回。
 */
export const Image = TiptapImage.extend({
  addOptions() {
    const parent = this.parent?.()
    return {
      ...parent,
      allowBase64: parent?.allowBase64 ?? false,
      HTMLAttributes: parent?.HTMLAttributes ?? {},
      resize: parent?.resize ?? false,
      inline: true,
      content: '',
      marks: '',
      group: 'inline',
      draggable: false,
      selectable: true,
      atom: true,
    }
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
      tempFileId: {
        default: null,
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
      percent: {
        default: 100,
      },
      heightPercent: {
        default: 1,
      },
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
    }
  },

  renderHTML({ node }) {
    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, {
        src: node.attrs.src,
        alt: node.attrs.alt,
        title: node.attrs.title,
        width: node.attrs.width,
        height: node.attrs.height,
        'data-original-width': node.attrs.originalWidth,
        'data-original-height': node.attrs.originalHeight,
        'data-percent': node.attrs.percent,
        'data-height-percent': node.attrs.heightPercent,
        'data-equal-proportion': node.attrs.equalProportion,
      }),
    ]
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: (element) => {
          const img = resolveImageEl(element as HTMLElement)
          return {
            src: img?.getAttribute('src') || img?.dataset.src,
            alt: img?.getAttribute('alt'),
            title: img?.getAttribute('title'),
            width: img?.getAttribute('width'),
            height: img?.getAttribute('height'),
            originalWidth:
              img?.dataset.originalWidth ||
              img?.getAttribute('data-original-width'),
            originalHeight:
              img?.dataset.originalHeight ||
              img?.getAttribute('data-original-height'),
            percent: img?.dataset.percent || img?.getAttribute('data-percent'),
            heightPercent:
              img?.dataset.heightPercent ||
              img?.getAttribute('data-height-percent'),
            equalProportion:
              img?.dataset.equalProportion !== undefined
                ? img.dataset.equalProportion === 'true'
                : true,
          }
        },
      },
    ]
  },
})
