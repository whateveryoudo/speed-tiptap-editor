import {
  Node,
  mergeAttributes
} from "./chunk-SBH6O76G.js";
import "./chunk-QH2UD4OR.js";
import "./chunk-RAHEMUA5.js";
import "./chunk-LHBYDABC.js";
import "./chunk-YFHF347W.js";
import "./chunk-XMIMIZUL.js";
import "./chunk-G3PMV62Z.js";

// node_modules/.pnpm/@tiptap+extension-table-header@2.0.0-beta.202_@tiptap+core@2.0.0-beta.202/node_modules/@tiptap/extension-table-header/dist/tiptap-extension-table-header.esm.js
var TableHeader = Node.create({
  name: "tableHeader",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "block+",
  addAttributes() {
    return {
      colspan: {
        default: 1
      },
      rowspan: {
        default: 1
      },
      colwidth: {
        default: null,
        parseHTML: (element) => {
          const colwidth = element.getAttribute("colwidth");
          const value = colwidth ? [parseInt(colwidth, 10)] : null;
          return value;
        }
      }
    };
  },
  tableRole: "header_cell",
  isolating: true,
  parseHTML() {
    return [
      { tag: "th" }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["th", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  }
});
export {
  TableHeader,
  TableHeader as default
};
//# sourceMappingURL=@tiptap_extension-table-header.js.map
