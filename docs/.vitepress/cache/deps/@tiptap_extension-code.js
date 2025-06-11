import {
  Mark,
  markInputRule,
  markPasteRule,
  mergeAttributes
} from "./chunk-SBH6O76G.js";
import "./chunk-QH2UD4OR.js";
import "./chunk-RAHEMUA5.js";
import "./chunk-LHBYDABC.js";
import "./chunk-YFHF347W.js";
import "./chunk-XMIMIZUL.js";
import "./chunk-G3PMV62Z.js";

// node_modules/.pnpm/@tiptap+extension-code@2.0.0-beta.202_@tiptap+core@2.0.0-beta.202/node_modules/@tiptap/extension-code/dist/tiptap-extension-code.esm.js
var inputRegex = /(?:^|\s)((?:`)((?:[^`]+))(?:`))$/;
var pasteRegex = /(?:^|\s)((?:`)((?:[^`]+))(?:`))/g;
var Code = Mark.create({
  name: "code",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  excludes: "_",
  code: true,
  exitable: true,
  parseHTML() {
    return [
      { tag: "code" }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["code", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setCode: () => ({ commands }) => {
        return commands.setMark(this.name);
      },
      toggleCode: () => ({ commands }) => {
        return commands.toggleMark(this.name);
      },
      unsetCode: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-e": () => this.editor.commands.toggleCode()
    };
  },
  addInputRules() {
    return [
      markInputRule({
        find: inputRegex,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      markPasteRule({
        find: pasteRegex,
        type: this.type
      })
    ];
  }
});
export {
  Code,
  Code as default,
  inputRegex,
  pasteRegex
};
//# sourceMappingURL=@tiptap_extension-code.js.map
