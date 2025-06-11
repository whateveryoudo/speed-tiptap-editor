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

// node_modules/.pnpm/@tiptap+extension-table-cell@2.0.0-beta.202_@tiptap+core@2.0.0-beta.202/node_modules/@tiptap/extension-table-cell/dist/tiptap-extension-table-cell.esm.js
var TableCell = Node.create({
  name: "tableCell",
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
  tableRole: "cell",
  isolating: true,
  parseHTML() {
    return [
      { tag: "td" }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["td", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  }
});
export {
  TableCell,
  TableCell as default
};
//# sourceMappingURL=@tiptap_extension-table-cell.js.map
