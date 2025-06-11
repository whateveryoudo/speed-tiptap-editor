import {
  Mark,
  mergeAttributes
} from "./chunk-SBH6O76G.js";
import "./chunk-QH2UD4OR.js";
import "./chunk-RAHEMUA5.js";
import "./chunk-LHBYDABC.js";
import "./chunk-YFHF347W.js";
import "./chunk-XMIMIZUL.js";
import "./chunk-G3PMV62Z.js";

// node_modules/.pnpm/@tiptap+extension-subscript@2.0.0-beta.202_@tiptap+core@2.0.0-beta.202/node_modules/@tiptap/extension-subscript/dist/tiptap-extension-subscript.esm.js
var Subscript = Mark.create({
  name: "subscript",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "sub"
      },
      {
        style: "vertical-align",
        getAttrs(value) {
          if (value !== "sub") {
            return false;
          }
          return null;
        }
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["sub", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setSubscript: () => ({ commands }) => {
        return commands.setMark(this.name);
      },
      toggleSubscript: () => ({ commands }) => {
        return commands.toggleMark(this.name);
      },
      unsetSubscript: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-,": () => this.editor.commands.toggleSubscript()
    };
  }
});
export {
  Subscript,
  Subscript as default
};
//# sourceMappingURL=@tiptap_extension-subscript.js.map
