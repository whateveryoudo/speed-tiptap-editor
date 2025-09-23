import { Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import Wrapper from "./Wrapper.vue";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: {
      setCallout: () => ReturnType;
    };
  }
}
export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "paragraph+",
  defining: true,
  selectable: false,
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
      },
    ];
  },
  renderHTML: () => {
    return ["div", { "data-type": "callout" }, 0];
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
});
