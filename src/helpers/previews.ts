import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
// 用于预览文档中的图片
export class EditorPreviewImage {
    private viewerInstance: any = null; // viewer实例
    private previewContainer: HTMLElement | null = null;
    private editor: any;

    constructor(editor: any,) {
        this.editor = editor;
    }

    // 获取所有图片src
    getAllImageSrcs(): string[] {
        debugger;
        const srcs: string[] = [];
        if (!this.editor) return srcs;
        this.editor.state.doc.descendants((node: any) => {
            if (node.type.name === 'image' && node.attrs.src) {
                srcs.push(node.attrs.src);
            }
        });
        return srcs;
    }

    // 初始化预览实例
    private initViewer(imageSrcs: string[]) {
        if (this.viewerInstance) {
            this.viewerInstance.destroy();
            this.viewerInstance = null;
        }
        // 创建一个容器来存放所有预览图片
        if (!this.previewContainer) {
            this.previewContainer = document.createElement('div');
            this.previewContainer.style.display = 'none';
            document.body.appendChild(this.previewContainer);
        }
        // 清空容器
        this.previewContainer.innerHTML = '';
        // 添加所有图片到容器
        imageSrcs.forEach(src => {
            if (src) {
                const img = document.createElement('img');
                img.src = src;
                this.previewContainer!.appendChild(img);
            }
        });
        // 创建查看器实例
        this.viewerInstance = new Viewer(this.previewContainer, {
            inline: false,
            navbar: imageSrcs.length > 1, // 只有多图时显示导航栏
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

    // 处理预览
    previewImage = (src: string) => {
        const srcs = this.getAllImageSrcs();
        this.initViewer(srcs);
        // 找到当前图片的索引
        const index = srcs.findIndex(f => f === src);
        if (index !== -1 && this.viewerInstance) {
            this.viewerInstance.view(index);
        }
    }
}

