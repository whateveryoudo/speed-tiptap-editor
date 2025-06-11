import "./chunk-3VK5X4HS.js";
import {
  Extension
} from "./chunk-SBH6O76G.js";
import "./chunk-QH2UD4OR.js";
import "./chunk-RAHEMUA5.js";
import "./chunk-LHBYDABC.js";
import "./chunk-YFHF347W.js";
import "./chunk-XMIMIZUL.js";
import "./chunk-G3PMV62Z.js";

// node_modules/.pnpm/@tiptap+extension-color@2.14.0_@tiptap+core@2.0.0-beta.202_@tiptap+extension-text-style@2.14._jojn3iejtl4hf4vzsq2vccjube/node_modules/@tiptap/extension-color/dist/index.js
var Color = Extension.create({
  name: "color",
  addOptions() {
    return {
      types: ["textStyle"]
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          color: {
            default: null,
            parseHTML: (element) => {
              var _a;
              return (_a = element.style.color) === null || _a === void 0 ? void 0 : _a.replace(/['"]+/g, "");
            },
            renderHTML: (attributes) => {
              if (!attributes.color) {
                return {};
              }
              return {
                style: `color: ${attributes.color}`
              };
            }
          }
        }
      }
    ];
  },
  addCommands() {
    return {
      setColor: (color) => ({ chain }) => {
        return chain().setMark("textStyle", { color }).run();
      },
      unsetColor: () => ({ chain }) => {
        return chain().setMark("textStyle", { color: null }).removeEmptyTextStyle().run();
      }
    };
  }
});
export {
  Color,
  Color as default
};
//# sourceMappingURL=@tiptap_extension-color.js.map
