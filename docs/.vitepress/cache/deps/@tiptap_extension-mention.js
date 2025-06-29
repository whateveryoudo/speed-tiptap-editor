import {
  Suggestion
} from "./chunk-H3XIOIU7.js";
import "./chunk-CUVOGQTC.js";
import "./chunk-LZ5FJABI.js";
import {
  Node,
  mergeAttributes
} from "./chunk-SBH6O76G.js";
import "./chunk-QH2UD4OR.js";
import "./chunk-RAHEMUA5.js";
import "./chunk-LHBYDABC.js";
import {
  PluginKey
} from "./chunk-YFHF347W.js";
import "./chunk-XMIMIZUL.js";
import "./chunk-G3PMV62Z.js";

// node_modules/.pnpm/@tiptap+extension-mention@2.14.0_@tiptap+core@2.0.0-beta.202_@tiptap+pm@2.14.0_@tiptap+sugges_thdvm77y2oz5h2c776obtpjgmu/node_modules/@tiptap/extension-mention/dist/index.js
var MentionPluginKey = new PluginKey("mention");
var Mention = Node.create({
  name: "mention",
  priority: 101,
  addOptions() {
    return {
      HTMLAttributes: {},
      renderText({ options, node }) {
        var _a;
        return `${options.suggestion.char}${(_a = node.attrs.label) !== null && _a !== void 0 ? _a : node.attrs.id}`;
      },
      deleteTriggerWithBackspace: false,
      renderHTML({ options, node }) {
        var _a;
        return [
          "span",
          mergeAttributes(this.HTMLAttributes, options.HTMLAttributes),
          `${options.suggestion.char}${(_a = node.attrs.label) !== null && _a !== void 0 ? _a : node.attrs.id}`
        ];
      },
      suggestion: {
        char: "@",
        pluginKey: MentionPluginKey,
        command: ({ editor, range, props }) => {
          var _a, _b, _c;
          const nodeAfter = editor.view.state.selection.$to.nodeAfter;
          const overrideSpace = (_a = nodeAfter === null || nodeAfter === void 0 ? void 0 : nodeAfter.text) === null || _a === void 0 ? void 0 : _a.startsWith(" ");
          if (overrideSpace) {
            range.to += 1;
          }
          editor.chain().focus().insertContentAt(range, [
            {
              type: this.name,
              attrs: props
            },
            {
              type: "text",
              text: " "
            }
          ]).run();
          (_c = (_b = editor.view.dom.ownerDocument.defaultView) === null || _b === void 0 ? void 0 : _b.getSelection()) === null || _c === void 0 ? void 0 : _c.collapseToEnd();
        },
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from);
          const type = state.schema.nodes[this.name];
          const allow = !!$from.parent.type.contentMatch.matchType(type);
          return allow;
        }
      }
    };
  },
  group: "inline",
  inline: true,
  selectable: false,
  atom: true,
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-id"),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }
          return {
            "data-id": attributes.id
          };
        }
      },
      label: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-label"),
        renderHTML: (attributes) => {
          if (!attributes.label) {
            return {};
          }
          return {
            "data-label": attributes.label
          };
        }
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: `span[data-type="${this.name}"]`
      }
    ];
  },
  renderHTML({ node, HTMLAttributes }) {
    if (this.options.renderLabel !== void 0) {
      console.warn("renderLabel is deprecated use renderText and renderHTML instead");
      return [
        "span",
        mergeAttributes({ "data-type": this.name }, this.options.HTMLAttributes, HTMLAttributes),
        this.options.renderLabel({
          options: this.options,
          node
        })
      ];
    }
    const mergedOptions = { ...this.options };
    mergedOptions.HTMLAttributes = mergeAttributes({ "data-type": this.name }, this.options.HTMLAttributes, HTMLAttributes);
    const html = this.options.renderHTML({
      options: mergedOptions,
      node
    });
    if (typeof html === "string") {
      return [
        "span",
        mergeAttributes({ "data-type": this.name }, this.options.HTMLAttributes, HTMLAttributes),
        html
      ];
    }
    return html;
  },
  renderText({ node }) {
    if (this.options.renderLabel !== void 0) {
      console.warn("renderLabel is deprecated use renderText and renderHTML instead");
      return this.options.renderLabel({
        options: this.options,
        node
      });
    }
    return this.options.renderText({
      options: this.options,
      node
    });
  },
  addKeyboardShortcuts() {
    return {
      Backspace: () => this.editor.commands.command(({ tr, state }) => {
        let isMention = false;
        const { selection } = state;
        const { empty, anchor } = selection;
        if (!empty) {
          return false;
        }
        state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
          if (node.type.name === this.name) {
            isMention = true;
            tr.insertText(this.options.deleteTriggerWithBackspace ? "" : this.options.suggestion.char || "", pos, pos + node.nodeSize);
            return false;
          }
        });
        return isMention;
      })
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion
      })
    ];
  }
});
export {
  Mention,
  MentionPluginKey,
  Mention as default
};
//# sourceMappingURL=@tiptap_extension-mention.js.map
