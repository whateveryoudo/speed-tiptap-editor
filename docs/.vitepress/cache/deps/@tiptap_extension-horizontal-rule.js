import "./chunk-LZ5FJABI.js";
import {
  Node,
  isNodeSelection,
  mergeAttributes,
  nodeInputRule
} from "./chunk-SBH6O76G.js";
import "./chunk-QH2UD4OR.js";
import "./chunk-RAHEMUA5.js";
import "./chunk-LHBYDABC.js";
import {
  NodeSelection,
  TextSelection
} from "./chunk-YFHF347W.js";
import "./chunk-XMIMIZUL.js";
import "./chunk-G3PMV62Z.js";

// node_modules/.pnpm/@tiptap+extension-horizontal-rule@2.14.0_@tiptap+core@2.0.0-beta.202_@tiptap+pm@2.14.0/node_modules/@tiptap/extension-horizontal-rule/dist/index.js
var HorizontalRule = Node.create({
  name: "horizontalRule",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  group: "block",
  parseHTML() {
    return [{ tag: "hr" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["hr", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },
  addCommands() {
    return {
      setHorizontalRule: () => ({ chain, state }) => {
        const { selection } = state;
        const { $from: $originFrom, $to: $originTo } = selection;
        const currentChain = chain();
        if ($originFrom.parentOffset === 0) {
          currentChain.insertContentAt({
            from: Math.max($originFrom.pos - 1, 0),
            to: $originTo.pos
          }, {
            type: this.name
          });
        } else if (isNodeSelection(selection)) {
          currentChain.insertContentAt($originTo.pos, {
            type: this.name
          });
        } else {
          currentChain.insertContent({ type: this.name });
        }
        return currentChain.command(({ tr, dispatch }) => {
          var _a;
          if (dispatch) {
            const { $to } = tr.selection;
            const posAfter = $to.end();
            if ($to.nodeAfter) {
              if ($to.nodeAfter.isTextblock) {
                tr.setSelection(TextSelection.create(tr.doc, $to.pos + 1));
              } else if ($to.nodeAfter.isBlock) {
                tr.setSelection(NodeSelection.create(tr.doc, $to.pos));
              } else {
                tr.setSelection(TextSelection.create(tr.doc, $to.pos));
              }
            } else {
              const node = (_a = $to.parent.type.contentMatch.defaultType) === null || _a === void 0 ? void 0 : _a.create();
              if (node) {
                tr.insert(posAfter, node);
                tr.setSelection(TextSelection.create(tr.doc, posAfter + 1));
              }
            }
            tr.scrollIntoView();
          }
          return true;
        }).run();
      }
    };
  },
  addInputRules() {
    return [
      nodeInputRule({
        find: /^(?:---|—-|___\s|\*\*\*\s)$/,
        type: this.type
      })
    ];
  }
});
export {
  HorizontalRule,
  HorizontalRule as default
};
//# sourceMappingURL=@tiptap_extension-horizontal-rule.js.map
