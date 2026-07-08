import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import type { Editor } from '@tiptap/core'

/** 预览文档中的图片 */
export class EditorPreviewImage {
  private viewerInstance: Viewer | null = null
  private previewContainer: HTMLElement | null = null
  private editor: Editor

  constructor(editor: Editor) {
    this.editor = editor
  }

  getAllImageSrcs(): string[] {
    const srcs: string[] = []
    if (!this.editor) return srcs
    this.editor.state.doc.descendants((node) => {
      if (node.type.name === 'image' && node.attrs.src) {
        srcs.push(node.attrs.src as string)
      }
    })
    return srcs
  }

  private initViewer(imageSrcs: string[]) {
    if (this.viewerInstance) {
      this.viewerInstance.destroy()
      this.viewerInstance = null
    }
    if (!this.previewContainer) {
      this.previewContainer = document.createElement('div')
      this.previewContainer.style.display = 'none'
      document.body.appendChild(this.previewContainer)
    }
    this.previewContainer.innerHTML = ''
    for (const src of imageSrcs) {
      if (src) {
        const img = document.createElement('img')
        img.src = src
        this.previewContainer.appendChild(img)
      }
    }
    this.viewerInstance = new Viewer(this.previewContainer, {
      inline: false,
      navbar: imageSrcs.length > 1,
      toolbar: {
        zoomIn: true,
        zoomOut: true,
        oneToOne: true,
        reset: true,
        prev: imageSrcs.length > 1,
        next: imageSrcs.length > 1,
        rotateLeft: true,
        rotateRight: true,
        flipHorizontal: true,
        flipVertical: true,
      },
    })
  }

  previewImage = (src: string) => {
    const srcs = this.getAllImageSrcs()
    this.initViewer(srcs)
    const index = srcs.findIndex((f) => f === src)
    if (index !== -1 && this.viewerInstance) {
      this.viewerInstance.view(index)
    }
  }
}
