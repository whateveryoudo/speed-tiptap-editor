import { Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import Wrapper from "./Wrapper.vue";
import { TextSelection, NodeSelection } from "@tiptap/pm/state";

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
  isolating: true,
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
    // 提取公共逻辑：删除当前段落节点并选中前一个节点（同一事务，位置映射）
    const deleteParagraphAndSelectPrev = (
      state: any,
      $from: any,
      prevNode: any,
      parentDepth: number
    ) => {
      const paraStart = $from.before(parentDepth);
      const paraEnd = $from.after(parentDepth);
      const prevNodeStartBefore = paraStart - prevNode.nodeSize;

      let tr = state.tr.delete(paraStart, paraEnd);
      const mappedPos = tr.mapping.map(prevNodeStartBefore, -1);
      tr = tr.setSelection(NodeSelection.create(tr.doc, mappedPos));
      return tr;
    };

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

      // Backspace 处理：简化版本，只处理选中删除和空节点删除(目前只有block gap能生效，其余只能移动光标到开始位置进行添加内容)
      Backspace: () => {
        const { state, dispatch } = this.editor.view;
        const { selection, doc } = state;
        const { $from } = selection;

        // 检查是否选中了 callout 节点
        if (selection instanceof TextSelection && !selection.empty) {
          const { from, to } = selection;
          const selectedNode = doc.nodeAt(from);
          if (selectedNode && selectedNode.type.name === this.name) {
            // 选中了 callout 节点，删除整个节点
            const tr = state.tr.delete(from, to);
            dispatch(tr);
            return true;
          }
        }
        // 检查是否在段落中，且前面是 callout
        if ($from.parent.type.name === "paragraph") {
          const atStart = selection.empty && $from.parentOffset === 0;
          if (atStart) {
            const parent = $from.node($from.depth - 1);
            const index = $from.index($from.depth - 1);

            if (index > 0) {
              const prevNode = parent.child(index - 1);
              if (prevNode.type.name === this.name) {
                const parentDepth = $from.depth;
                const tr = deleteParagraphAndSelectPrev(
                  state,
                  $from,
                  prevNode,
                  parentDepth
                );
                dispatch(tr);
                return true;
              }
            }
          }
        }

        // 检查是否在 callout 内部
        let calloutDepth = -1;
        for (let d = $from.depth; d >= 0; d--) {
          const node = $from.node(d);
          if (node.type.name === this.name) {
            calloutDepth = d;
            break;
          }
        }

        if (calloutDepth === -1) return false;

        // 检查是否在 callout 内容的开头（这里处理）
        const atStart = selection.empty && $from.parentOffset === 0;
        if (!atStart) return false;

        // 检查 callout 是否为空（只有一个空段落）
        const calloutNode = $from.node(calloutDepth);
        if (calloutNode.childCount === 1) {
          const firstChild = calloutNode.firstChild;
          if (
            firstChild &&
            firstChild.type.name === "paragraph" &&
            firstChild.textContent === ""
          ) {
            // 空 callout，删除整个节点
            const calloutStart = $from.before(calloutDepth);
            const calloutEnd = $from.after(calloutDepth);
            const tr = state.tr.delete(calloutStart, calloutEnd);
            dispatch(tr);
            return true;
          }
        }

        // 其他情况让默认行为处理
        return false;
      },
    };
  },
});
