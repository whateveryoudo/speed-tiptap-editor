import { Node, mergeAttributes } from '@tiptap/core'

const dataAttr =
  (key: string) =>
  (element: HTMLElement) =>
    element.getAttribute(`data-${key}`)

/**
 * 无 UI 附件节点：去掉上传命令 / Vue NodeView。
 */
export const Attachment = Node.create({
  name: 'attachment',
  content: '',
  inline: true,
  marks: '',
  group: 'inline',
  selectable: true,
  atom: true,
  draggable: false,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'attachment',
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[class=attachment]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, {
        'data-temp-file-id': HTMLAttributes.tempFileId,
        'data-file-id': HTMLAttributes.fileId,
        'data-file-name': HTMLAttributes.fileName,
        'data-file-size': HTMLAttributes.fileSize,
        'data-file-type': HTMLAttributes.fileType,
        'data-file-ext': HTMLAttributes.fileExt,
        'data-file-url': HTMLAttributes.fileUrl,
        'data-file-preview-url': HTMLAttributes.filePreviewUrl,
        'data-display-mode': HTMLAttributes.displayMode,
      }),
    ]
  },

  addAttributes() {
    return {
      displayMode: {
        default: 'title',
        parseHTML: (el) => dataAttr('display-mode')(el as HTMLElement) ?? 'title',
      },
      tempFileId: {
        default: null,
      },
      fileName: {
        default: null,
        parseHTML: (el) => dataAttr('file-name')(el as HTMLElement),
      },
      fileSize: {
        default: null,
        parseHTML: (el) => dataAttr('file-size')(el as HTMLElement),
      },
      fileType: {
        default: null,
        parseHTML: (el) => dataAttr('file-type')(el as HTMLElement),
      },
      fileId: {
        default: null,
        parseHTML: (el) => dataAttr('file-id')(el as HTMLElement),
      },
    }
  },
})
