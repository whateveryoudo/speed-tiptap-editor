/*
 * @Author: Claude
 * @Description: 缩进扩展
 */
import { Extension } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
    };
  }
}

export const Indent = Extension.create({
  name: "indent",

  addOptions() {
    return {
      types: ["paragraph", "heading", "listItem"],
      minIndent: 0,
      maxIndent: 8,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            renderHTML: (attributes) => {
              if (attributes.indent === 0) {
                return {};
              }

              return {
                style: `padding-left: ${attributes.indent}em`,
              };
            },
            parseHTML: (element) => {
              const indent = parseInt(element.style.paddingLeft, 10);
              return isNaN(indent) ? 0 : indent;
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { ranges } = selection;
          console.log(ranges);
          if (!dispatch) return false;

          ranges.forEach((range) => {
            state.doc.nodesBetween(
              range.$from.pos,
              range.$to.pos,
              (node, pos) => {
                console.log(node, pos);
                if (this.options.types.includes(node.type.name)) {
                  const indent = (node.attrs.indent || 0) + 1;
                  if (indent <= this.options.maxIndent) {
                    tr.setNodeMarkup(pos, null, {
                      ...node.attrs,
                      indent,
                    });
                  }
                }
              }
            );
          });

          return true;
        },
      outdent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { ranges } = selection;

          if (!dispatch) return false;

          ranges.forEach((range) => {
            state.doc.nodesBetween(
              range.$from.pos,
              range.$to.pos,
              (node, pos) => {
                if (this.options.types.includes(node.type.name)) {
                  const indent = (node.attrs.indent || 0) - 1;
                  if (indent >= this.options.minIndent) {
                    tr.setNodeMarkup(pos, null, {
                      ...node.attrs,
                      indent,
                    });
                  }
                }
              }
            );
          });

          return true;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.indent(),
      "Shift-Tab": () => this.editor.commands.outdent(),
      // 需要处理退格键（退格也支持下减少缩进）
      Backspace: () => {
        const { state } = this.editor;
        const { selection } = state;
        // 只处理光标在段落/标题/列表项开头的情况
        if (selection.empty && selection.$from.parentOffset === 0) {
          const node = selection.$from.parent;
          if (node.attrs.indent > 0) {
            this.editor.commands.outdent();
            return true; // 阻止默认退格
          }
        }
        return false; // 走默认退格逻辑
      },
    };
  },
});
