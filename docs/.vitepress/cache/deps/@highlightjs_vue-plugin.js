import {
  computed,
  defineComponent,
  h,
  ref,
  watch
} from "./chunk-5U2WJACE.js";
import {
  require_core
} from "./chunk-4WYE2GUT.js";
import {
  __toESM
} from "./chunk-G3PMV62Z.js";

// node_modules/.pnpm/highlight.js@11.11.1/node_modules/highlight.js/es/core.js
var import_core = __toESM(require_core());
var core_default = import_core.default;

// node_modules/.pnpm/@highlightjs+vue-plugin@2.1.2_highlight.js@11.11.1_vue@3.5.16_typescript@5.8.3_/node_modules/@highlightjs/vue-plugin/dist/highlightjs-vue.esm.min.js
var r = defineComponent({ props: { code: { type: String, required: true }, language: { type: String, default: "" }, autodetect: { type: Boolean, default: true }, ignoreIllegals: { type: Boolean, default: true } }, setup: function(e) {
  var n = ref(e.language);
  watch(function() {
    return e.language;
  }, function(e2) {
    n.value = e2;
  });
  var r2 = computed(function() {
    return e.autodetect || !n.value;
  }), o2 = computed(function() {
    return !r2.value && !core_default.getLanguage(n.value);
  });
  return { className: computed(function() {
    return o2.value ? "" : "hljs " + n.value;
  }), highlightedCode: computed(function() {
    var a;
    if (o2.value) return console.warn('The language "' + n.value + '" you specified could not be found.'), e.code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
    if (r2.value) {
      var l = core_default.highlightAuto(e.code);
      return n.value = null !== (a = l.language) && void 0 !== a ? a : "", l.value;
    }
    return (l = core_default.highlight(e.code, { language: n.value, ignoreIllegals: e.ignoreIllegals })).value;
  }) };
}, render: function() {
  return h("pre", {}, [h("code", { class: this.className, innerHTML: this.highlightedCode, tabindex: "0" })]);
} });
var o = { install: function(e) {
  e.component("highlightjs", r);
}, component: r };
var highlightjs_vue_esm_min_default = o;
export {
  highlightjs_vue_esm_min_default as default
};
//# sourceMappingURL=@highlightjs_vue-plugin.js.map
