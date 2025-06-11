import {
  Mark,
  mergeAttributes
} from "./chunk-SBH6O76G.js";

// node_modules/.pnpm/@tiptap+extension-text-style@2.14.0_@tiptap+core@2.0.0-beta.202/node_modules/@tiptap/extension-text-style/dist/index.js
var mergeNestedSpanStyles = (element) => {
  if (!element.children.length) {
    return;
  }
  const childSpans = element.querySelectorAll("span");
  if (!childSpans) {
    return;
  }
  childSpans.forEach((childSpan) => {
    var _a, _b;
    const childStyle = childSpan.getAttribute("style");
    const closestParentSpanStyleOfChild = (_b = (_a = childSpan.parentElement) === null || _a === void 0 ? void 0 : _a.closest("span")) === null || _b === void 0 ? void 0 : _b.getAttribute("style");
    childSpan.setAttribute("style", `${closestParentSpanStyleOfChild};${childStyle}`);
  });
};
var TextStyle = Mark.create({
  name: "textStyle",
  priority: 101,
  addOptions() {
    return {
      HTMLAttributes: {},
      mergeNestedSpanStyles: false
    };
  },
  parseHTML() {
    return [
      {
        tag: "span",
        getAttrs: (element) => {
          const hasStyles = element.hasAttribute("style");
          if (!hasStyles) {
            return false;
          }
          if (this.options.mergeNestedSpanStyles) {
            mergeNestedSpanStyles(element);
          }
          return {};
        }
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addCommands() {
    return {
      removeEmptyTextStyle: () => ({ tr }) => {
        const { selection } = tr;
        tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
          if (node.isTextblock) {
            return true;
          }
          if (!node.marks.filter((mark) => mark.type === this.type).some((mark) => Object.values(mark.attrs).some((value) => !!value))) {
            tr.removeMark(pos, pos + node.nodeSize, this.type);
          }
        });
        return true;
      }
    };
  }
});

export {
  TextStyle
};
//# sourceMappingURL=chunk-3VK5X4HS.js.map
