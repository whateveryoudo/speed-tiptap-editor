import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";
import type { Editor } from "@tiptap/core";

/** 预览文档中的图片 */
export class EditorPreviewImage {
  private viewerInstance: Viewer | null = null;
  private previewContainer: HTMLElement | null = null;
  private editor: Editor;
  /** 与展示层一致：拼 preview URL 用（为什么这样处理：tiptap内部存储的json如果直接带上死的token,过期后会无法访问资源，这里采用前端动态拼接） */
  private getAccessToken: () => string | undefined;

  constructor(editor: Editor, getAccessToken?: () => string | undefined) {
    this.editor = editor;
    this.getAccessToken = getAccessToken ?? (() => undefined);
  }

  /** 文档存无 token 的 src；预览时统一带上 access_token */
  private resolveSrc(src: string): string {
    if (!src || src.startsWith("data:")) return src;
    const token = this.getAccessToken();
    if (!token) return src;
    return `${src.split("?")[0]}?access_token=${token}`;
  }

  getAllImageSrcs(): string[] {
    const srcs: string[] = [];
    if (!this.editor) return srcs;
    this.editor.state.doc.descendants((node) => {
      if (node.type.name === "image" && node.attrs.src) {
        srcs.push(this.resolveSrc(node.attrs.src as string));
      }
    });
    return srcs;
  }

  private initViewer(imageSrcs: string[]) {
    if (this.viewerInstance) {
      this.viewerInstance.destroy();
      this.viewerInstance = null;
    }
    if (!this.previewContainer) {
      this.previewContainer = document.createElement("div");
      this.previewContainer.style.display = "none";
      document.body.appendChild(this.previewContainer);
    }
    this.previewContainer.innerHTML = "";
    for (const src of imageSrcs) {
      if (src) {
        const img = document.createElement("img");
        img.src = src;
        this.previewContainer.appendChild(img);
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
    });
  }

  previewImage = (src: string) => {
    const srcs = this.getAllImageSrcs();
    const target = this.resolveSrc(src);
    this.initViewer(srcs);
    const index = srcs.findIndex((f) => f === target);
    if (index !== -1 && this.viewerInstance) {
      this.viewerInstance.view(index);
    }
  };
}
