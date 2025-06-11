import {
  Node,
  mergeAttributes,
  wrappingInputRule
} from "./chunk-SBH6O76G.js";
import "./chunk-QH2UD4OR.js";
import "./chunk-RAHEMUA5.js";
import "./chunk-LHBYDABC.js";
import "./chunk-YFHF347W.js";
import "./chunk-XMIMIZUL.js";
import "./chunk-G3PMV62Z.js";

// node_modules/.pnpm/@tiptap+extension-blockquote@2.14.0_@tiptap+core@2.0.0-beta.202/node_modules/@tiptap/extension-blockquote/dist/index.js
var inputRegex = /^\s*>\s$/;
var Blockquote = Node.create({
  name: "blockquote",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "block+",
  group: "block",
  defining: true,
  parseHTML() {
    return [
      { tag: "blockquote" }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["blockquote", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setBlockquote: () => ({ commands }) => {
        return commands.wrapIn(this.name);
      },
      toggleBlockquote: () => ({ commands }) => {
        return commands.toggleWrap(this.name);
      },
      unsetBlockquote: () => ({ commands }) => {
        return commands.lift(this.name);
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-b": () => this.editor.commands.toggleBlockquote()
    };
  },
  addInputRules() {
    return [
      wrappingInputRule({
        find: inputRegex,
        type: this.type
      })
    ];
  }
});
export {
  Blockquote,
  Blockquote as default,
  inputRegex
};
//# sourceMappingURL=@tiptap_extension-blockquote.js.map
