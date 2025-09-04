import { Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
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
    return [{ tag: 'span[data-type="tag"]' }];
  },
  addCommands() {
    return {
      insertTag:
        (attrs: { text: string; color: string; bgColor: string }) =>
        ({ chain }) => {
          return chain().insertContent({ type: this.name, attrs }).run();
        },
    };
  },
  addNodeView() {
    return VueNodeViewRenderer(Wrapper);
  },
});
