import { Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import Wrapper from "./Wrapper.vue";
import { TextSelection } from "@tiptap/pm/state";
import { GapCursor } from "@tiptap/pm/gapcursor";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: {
      setCallout: () => ReturnType;
    };
  }
}
export const Callout = Node.create({
  name: "callout",
  priority: 1000,
  group: "block",
  content: "paragraph+",
  defining: true,
  selectable: true,
  // isolating: true,  这里允许删除自身
  addAttributes: () => {
    return {
      bgColor: {
        default: "rgba(217,201,248,0.5)",
      },
      color: {
        default: "#000000",
      },
      icon: {
        default: null,
      },
    };
  },
  parseHTML: () => {
    return [
      {
        tag: 'div[data-type="callout"]',
        getAttrs: (dom) => {
          // 这里直接全部从自定义属性中获取
          return {
            bgColor: (dom as any).dataset.bgColor,
            color: (dom as any).dataset.color,
            icon: (dom as any).dataset.icon,
          };
        },
      },
    ];
  },
  // 这里存放部分的style(且同时存放在自定义属性中)
  renderHTML: ({ node }) => {
    return [
      "div",
      {
        "data-type": "callout",
        "data-bg-color": node.attrs.bgColor,
        "data-color": node.attrs.color,
        "data-icon": node.attrs.icon,
        style: `background-color: ${node.attrs.bgColor}; color: ${node.attrs.color};`,
      },
      0,
    ];
  },
  addNodeView() {
    return VueNodeViewRenderer(Wrapper);
  },
  addCommands() {
    return {
      setCallout:
        () =>
        ({ chain }) => {
          return chain()
            .focus()
            .insertContent({
              type: this.name,
              content: [{ type: "paragraph" }],
            })
            .run();
        },
    };
  },
  addKeyboardShortcuts() {
    return {
      // 处理 Ctrl+A，确保只在 Callout 内部全选
      "Mod-a": () => {
        const { state, dispatch } = this.editor.view;
        const { selection, doc } = state;
        const { $from } = selection;

        // 向上找最近的 callout 节点
        for (let d = $from.depth; d >= 0; d--) {
          const node = $from.node(d);
          if (node.type.name === this.name) {
            // 仅选中 callout 的内容，不包含外层节点本身
            const from = $from.start(d); // callout 内容起点（第一个子节点前）
            const to = $from.end(d); // callout 内容终点（最后一个子节点后）
            dispatch(
              state.tr.setSelection(TextSelection.create(doc, from, to))
            );
            return true; // 阻止默认全选（整篇文档）
          }
        }

        return false;
      },
      // 先屏蔽，内部带有输入的情况处理起来太麻烦
      // 两步删除：先选中整块，再删除整块（Backspace - 段落开头）
      // Backspace: () => {
      //   const { state, dispatch } = this.editor.view;
      //   const selection: any = state.selection;
      //   const $from = selection.$from;
      //   const isGap = state.selection instanceof GapCursor;

      //   // 计算块级兄弟
      //   const blockDepth = $from.depth;
      //   const parentDepth = blockDepth - 1;
      //   if (isGap) {
      //     // GapCursor：用顶层（doc → depth 0 / before(1)）
      //     const top = $from.node(0);
      //     const index0 = $from.index(0);
      //     if (index0 > 0) {
      //       const prev = top.child(index0 - 1);
      //       // 优先删除段落（无论是否为空），否则删除 callout
      //       if (prev.type.name === 'paragraph') {
      //         const leftEnd = $from.before(1);
      //         const prevStart = leftEnd - prev.nodeSize;
      //         dispatch(state.tr.delete(prevStart, leftEnd));
      //         return true;
      //       }
      //       if (prev.type.name === this.name) {
      //         const leftEnd = $from.before(1);
      //         const prevStart = leftEnd - prev.nodeSize;
      //         dispatch(state.tr.delete(prevStart, leftEnd));
      //         return true;
      //       }
      //     }
      //     return false;
      //   }

      //   if (parentDepth < 0) return false;
      //   const parent = $from.node(parentDepth);
      //   const indexInParent = $from.index(parentDepth);

      //   // 文本选区在块开头：优先删除上一个段落（不管是否为空），否则删除上一个 callout
      //   const atStart = selection.empty && $from.parentOffset === 0;
      //   if (!atStart) return false;
      //   if (indexInParent <= 0) return false;
      //   {
      //     const prev = parent.child(indexInParent - 1);
      //     const currentStart = $from.before(blockDepth);
      //     if (prev.type.name === 'paragraph') {
      //       const prevStart = currentStart - prev.nodeSize;
      //       dispatch(state.tr.delete(prevStart, currentStart));
      //       return true;
      //     }
      //     if (prev.type.name === this.name) {
      //       const prevStart = currentStart - prev.nodeSize;
      //       dispatch(state.tr.delete(prevStart, currentStart));
      //       return true;
      //     }
      //   }
      //   return false;
      // },

      // // 两步删除：先选中整块，再删除整块（Delete - 段落末尾）
      // Delete: () => {
      //   const { state, dispatch } = this.editor.view;
      //   const selection: any = state.selection;
      //   const $from = selection.$from;
      //   const isGap = state.selection instanceof GapCursor;

      //   // 计算块级兄弟
      //   const blockDepth = $from.depth;
      //   const parentDepth = blockDepth - 1;
      //   if (isGap) {
      //     // GapCursor：用顶层（doc → depth 0 / after(1)）
      //     const top = $from.node(0);
      //     const index0 = $from.index(0);
      //     if (index0 < top.childCount) {
      //       const next = top.child(index0);
      //       // 优先删除段落（不管是否为空），否则删除 callout
      //       if (next.type.name === 'paragraph') {
      //         const rightStart = $from.after(1);
      //         const rightEnd = rightStart + next.nodeSize;
      //         dispatch(state.tr.delete(rightStart, rightEnd));
      //         return true;
      //       }
      //       if (next.type.name === this.name) {
      //         const rightStart = $from.after(1);
      //         const rightEnd = rightStart + next.nodeSize;
      //         dispatch(state.tr.delete(rightStart, rightEnd));
      //         return true;
      //       }
      //     }
      //     return false;
      //   }

      //   if (parentDepth < 0) return false;
      //   const parent = $from.node(parentDepth);
      //   const indexInParent = $from.index(parentDepth);

      //   // 文本选区在块末尾：优先删除下一个段落（不管是否为空），否则删除下一个 callout
      //   const atEnd = selection.empty && $from.parentOffset === $from.parent.nodeSize - 2;
      //   if (!atEnd) return false;
      //   if (indexInParent >= parent.childCount - 1) return false;
      //   {
      //     const next = parent.child(indexInParent + 1);
      //     const nextStart = $from.after(blockDepth);
      //     if (next.type.name === 'paragraph') {
      //       const nextEnd = nextStart + next.nodeSize;
      //       dispatch(state.tr.delete(nextStart, nextEnd));
      //       return true;
      //     }
      //     if (next.type.name === this.name) {
      //       const nextEnd = nextStart + next.nodeSize;
      //       dispatch(state.tr.delete(nextStart, nextEnd));
      //       return true;
      //     }
      //   }
      //   return false;
      // },
    };
  },
});
