import {
  __commonJS
} from "./chunk-G3PMV62Z.js";

// node_modules/.pnpm/toggle-selection@1.0.6/node_modules/toggle-selection/index.js
var require_toggle_selection = __commonJS({
  "node_modules/.pnpm/toggle-selection@1.0.6/node_modules/toggle-selection/index.js"(exports, module) {
    module.exports = function() {
      var selection = document.getSelection();
      if (!selection.rangeCount) {
        return function() {
        };
      }
      var active = document.activeElement;
      var ranges = [];
      for (var i = 0; i < selection.rangeCount; i++) {
        ranges.push(selection.getRangeAt(i));
      }
      switch (active.tagName.toUpperCase()) {
        case "INPUT":
        case "TEXTAREA":
          active.blur();
          break;
        default:
          active = null;
          break;
      }
      selection.removeAllRanges();
      return function() {
        selection.type === "Caret" && selection.removeAllRanges();
        if (!selection.rangeCount) {
          ranges.forEach(function(range) {
            selection.addRange(range);
          });
        }
        active && active.focus();
      };
    };
  }
});
export default require_toggle_selection();
//# sourceMappingURL=toggle-selection.js.map
