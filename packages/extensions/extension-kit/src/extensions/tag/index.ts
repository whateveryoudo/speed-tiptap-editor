import { Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import { NodeSelection } from "@tiptap/pm/state";
import Wrapper from "./Wrapper.vue";
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    tag: {
      insertTag: (attrs: {
        text: string;
        color: string;
        bgColor: string;
      }) => ReturnType;
    };
  }
}

export const Tag = Node.create({
  name: "tag",
  content: "",
  atom: true,
  draggable: false,
  selectable: true,
  marks: "",
  group: "inline",
  inline: true,
  isolating: true,
  addAttributes() {
    return {
      text: {
        default: "标签内容",
      },
      color: {
        default: "#000000",
      },
      bgColor: {
        default: "rgba(0, 0, 0, 0.05)",
      },
    };
  },
  renderHTML({ node }) {
    return [
      "span",
      {
        "data-type": "tag",
        style: `color: ${node.attrs.color}; background-color: ${node.attrs.bgColor};`,
      },
      node.attrs.text,
    ];
  },
  parseHTML() {
    return [
      {
        tag: 'span[data-type="tag"]',
        getAttrs: (dom) => {
          return {
            color: dom.style.color,
            bgColor: dom.style.backgroundColor,
          };
        },
      },
    ];
  },
  addCommands() {
    return {
      insertTag:
        (attrs: { text: string; color: string; bgColor: string }) =>
        ({ chain, state }) => {
          const { selection } = state;
          const { from } = selection;

          // 使用更简单的方法：插入后直接选中
          return chain()
            .insertContent({ type: this.name, attrs })
            .command(({ tr, state }) => {
              // 在插入后，查找并选中刚插入的标签节点

              // 从插入位置开始查找标签节点
              state.doc.nodesBetween(
                from,
                state.doc.content.size,
                (node, pos) => {
                  if (node.type.name === this.name) {
                    const nodeSelection = NodeSelection.create(tr.doc, pos);
                    tr.setSelection(nodeSelection);
                    return false; // 停止遍历
                  }
                }
              );

              return true;
            })
            .run();
        },
    };
  },
  addNodeView() {
    return VueNodeViewRenderer(Wrapper);
  },
});
