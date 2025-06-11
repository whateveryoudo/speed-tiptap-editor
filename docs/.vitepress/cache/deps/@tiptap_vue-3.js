import {
  tippy_esm_default
} from "./chunk-TDU35ASC.js";
import "./chunk-LZ5FJABI.js";
import {
  CommandManager,
  Editor,
  Extension,
  InputRule,
  Mark,
  Node,
  NodeView,
  PasteRule,
  Tracker,
  callOrReturn,
  combineTransactionSteps,
  defaultBlockAt,
  escapeForRegEx,
  extensions,
  findChildren,
  findChildrenInRange,
  findParentNode,
  findParentNodeClosestToPos,
  generateHTML,
  generateJSON,
  generateText,
  getAttributes,
  getChangedRanges,
  getDebugJSON,
  getExtensionField,
  getHTMLFromFragment,
  getMarkAttributes,
  getMarkRange,
  getMarkType,
  getMarksBetween,
  getNodeAttributes,
  getNodeType,
  getSchema,
  getText,
  getTextBetween,
  getTextContentFromNodes,
  getTextSerializersFromSchema,
  inputRulesPlugin,
  isActive,
  isList,
  isMarkActive,
  isNodeActive,
  isNodeEmpty,
  isNodeSelection,
  isTextSelection,
  markInputRule,
  markPasteRule,
  mergeAttributes,
  nodeInputRule,
  nodePasteRule,
  pasteRulesPlugin,
  posToDOMRect,
  textInputRule,
  textPasteRule,
  textblockTypeInputRule,
  wrappingInputRule
} from "./chunk-SBH6O76G.js";
import "./chunk-QH2UD4OR.js";
import "./chunk-RAHEMUA5.js";
import "./chunk-LHBYDABC.js";
import {
  Plugin,
  PluginKey
} from "./chunk-YFHF347W.js";
import "./chunk-XMIMIZUL.js";
import {
  Teleport,
  customRef,
  defineComponent,
  getCurrentInstance,
  h,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
  ref,
  shallowRef,
  unref,
  watchEffect
} from "./chunk-5U2WJACE.js";
import "./chunk-G3PMV62Z.js";

// node_modules/.pnpm/@tiptap+extension-bubble-menu@2.14.0_@tiptap+core@2.0.0-beta.202_@tiptap+pm@2.14.0/node_modules/@tiptap/extension-bubble-menu/dist/index.js
var BubbleMenuView = class {
  constructor({ editor, element, view, tippyOptions = {}, updateDelay = 250, shouldShow }) {
    this.preventHide = false;
    this.shouldShow = ({ view: view2, state, from, to }) => {
      const { doc, selection } = state;
      const { empty } = selection;
      const isEmptyTextBlock = !doc.textBetween(from, to).length && isTextSelection(state.selection);
      const isChildOfMenu = this.element.contains(document.activeElement);
      const hasEditorFocus = view2.hasFocus() || isChildOfMenu;
      if (!hasEditorFocus || empty || isEmptyTextBlock || !this.editor.isEditable) {
        return false;
      }
      return true;
    };
    this.mousedownHandler = () => {
      this.preventHide = true;
    };
    this.dragstartHandler = () => {
      this.hide();
    };
    this.focusHandler = () => {
      setTimeout(() => this.update(this.editor.view));
    };
    this.blurHandler = ({ event }) => {
      var _a;
      if (this.preventHide) {
        this.preventHide = false;
        return;
      }
      if ((event === null || event === void 0 ? void 0 : event.relatedTarget) && ((_a = this.element.parentNode) === null || _a === void 0 ? void 0 : _a.contains(event.relatedTarget))) {
        return;
      }
      if ((event === null || event === void 0 ? void 0 : event.relatedTarget) === this.editor.view.dom) {
        return;
      }
      this.hide();
    };
    this.tippyBlurHandler = (event) => {
      this.blurHandler({ event });
    };
    this.handleDebouncedUpdate = (view2, oldState) => {
      const selectionChanged = !(oldState === null || oldState === void 0 ? void 0 : oldState.selection.eq(view2.state.selection));
      const docChanged = !(oldState === null || oldState === void 0 ? void 0 : oldState.doc.eq(view2.state.doc));
      if (!selectionChanged && !docChanged) {
        return;
      }
      if (this.updateDebounceTimer) {
        clearTimeout(this.updateDebounceTimer);
      }
      this.updateDebounceTimer = window.setTimeout(() => {
        this.updateHandler(view2, selectionChanged, docChanged, oldState);
      }, this.updateDelay);
    };
    this.updateHandler = (view2, selectionChanged, docChanged, oldState) => {
      var _a, _b, _c;
      const { state, composing } = view2;
      const { selection } = state;
      const isSame = !selectionChanged && !docChanged;
      if (composing || isSame) {
        return;
      }
      this.createTooltip();
      const { ranges } = selection;
      const from = Math.min(...ranges.map((range) => range.$from.pos));
      const to = Math.max(...ranges.map((range) => range.$to.pos));
      const shouldShow2 = (_a = this.shouldShow) === null || _a === void 0 ? void 0 : _a.call(this, {
        editor: this.editor,
        element: this.element,
        view: view2,
        state,
        oldState,
        from,
        to
      });
      if (!shouldShow2) {
        this.hide();
        return;
      }
      (_b = this.tippy) === null || _b === void 0 ? void 0 : _b.setProps({
        getReferenceClientRect: ((_c = this.tippyOptions) === null || _c === void 0 ? void 0 : _c.getReferenceClientRect) || (() => {
          if (isNodeSelection(state.selection)) {
            let node = view2.nodeDOM(from);
            if (node) {
              const nodeViewWrapper = node.dataset.nodeViewWrapper ? node : node.querySelector("[data-node-view-wrapper]");
              if (nodeViewWrapper) {
                node = nodeViewWrapper.firstChild;
              }
              if (node) {
                return node.getBoundingClientRect();
              }
            }
          }
          return posToDOMRect(view2, from, to);
        })
      });
      this.show();
    };
    this.editor = editor;
    this.element = element;
    this.view = view;
    this.updateDelay = updateDelay;
    if (shouldShow) {
      this.shouldShow = shouldShow;
    }
    this.element.addEventListener("mousedown", this.mousedownHandler, { capture: true });
    this.view.dom.addEventListener("dragstart", this.dragstartHandler);
    this.editor.on("focus", this.focusHandler);
    this.editor.on("blur", this.blurHandler);
    this.tippyOptions = tippyOptions;
    this.element.remove();
    this.element.style.visibility = "visible";
  }
  createTooltip() {
    const { element: editorElement } = this.editor.options;
    const editorIsAttached = !!editorElement.parentElement;
    if (this.tippy || !editorIsAttached) {
      return;
    }
    this.tippy = tippy_esm_default(editorElement, {
      duration: 0,
      getReferenceClientRect: null,
      content: this.element,
      interactive: true,
      trigger: "manual",
      placement: "top",
      hideOnClick: "toggle",
      ...this.tippyOptions
    });
    if (this.tippy.popper.firstChild) {
      this.tippy.popper.firstChild.addEventListener("blur", this.tippyBlurHandler);
    }
  }
  update(view, oldState) {
    const { state } = view;
    const hasValidSelection = state.selection.from !== state.selection.to;
    if (this.updateDelay > 0 && hasValidSelection) {
      this.handleDebouncedUpdate(view, oldState);
      return;
    }
    const selectionChanged = !(oldState === null || oldState === void 0 ? void 0 : oldState.selection.eq(view.state.selection));
    const docChanged = !(oldState === null || oldState === void 0 ? void 0 : oldState.doc.eq(view.state.doc));
    this.updateHandler(view, selectionChanged, docChanged, oldState);
  }
  show() {
    var _a;
    (_a = this.tippy) === null || _a === void 0 ? void 0 : _a.show();
  }
  hide() {
    var _a;
    (_a = this.tippy) === null || _a === void 0 ? void 0 : _a.hide();
  }
  destroy() {
    var _a, _b;
    if ((_a = this.tippy) === null || _a === void 0 ? void 0 : _a.popper.firstChild) {
      this.tippy.popper.firstChild.removeEventListener("blur", this.tippyBlurHandler);
    }
    (_b = this.tippy) === null || _b === void 0 ? void 0 : _b.destroy();
    this.element.removeEventListener("mousedown", this.mousedownHandler, { capture: true });
    this.view.dom.removeEventListener("dragstart", this.dragstartHandler);
    this.editor.off("focus", this.focusHandler);
    this.editor.off("blur", this.blurHandler);
  }
};
var BubbleMenuPlugin = (options) => {
  return new Plugin({
    key: typeof options.pluginKey === "string" ? new PluginKey(options.pluginKey) : options.pluginKey,
    view: (view) => new BubbleMenuView({ view, ...options })
  });
};
var BubbleMenu = Extension.create({
  name: "bubbleMenu",
  addOptions() {
    return {
      element: null,
      tippyOptions: {},
      pluginKey: "bubbleMenu",
      updateDelay: void 0,
      shouldShow: null
    };
  },
  addProseMirrorPlugins() {
    if (!this.options.element) {
      return [];
    }
    return [
      BubbleMenuPlugin({
        pluginKey: this.options.pluginKey,
        editor: this.editor,
        element: this.options.element,
        tippyOptions: this.options.tippyOptions,
        updateDelay: this.options.updateDelay,
        shouldShow: this.options.shouldShow
      })
    ];
  }
});

// node_modules/.pnpm/@tiptap+extension-floating-menu@2.14.0_@tiptap+core@2.0.0-beta.202_@tiptap+pm@2.14.0/node_modules/@tiptap/extension-floating-menu/dist/index.js
var FloatingMenuView = class {
  getTextContent(node) {
    return getText(node, { textSerializers: getTextSerializersFromSchema(this.editor.schema) });
  }
  constructor({ editor, element, view, tippyOptions = {}, shouldShow }) {
    this.preventHide = false;
    this.shouldShow = ({ view: view2, state }) => {
      const { selection } = state;
      const { $anchor, empty } = selection;
      const isRootDepth = $anchor.depth === 1;
      const isEmptyTextBlock = $anchor.parent.isTextblock && !$anchor.parent.type.spec.code && !$anchor.parent.textContent && $anchor.parent.childCount === 0 && !this.getTextContent($anchor.parent);
      if (!view2.hasFocus() || !empty || !isRootDepth || !isEmptyTextBlock || !this.editor.isEditable) {
        return false;
      }
      return true;
    };
    this.mousedownHandler = () => {
      this.preventHide = true;
    };
    this.focusHandler = () => {
      setTimeout(() => this.update(this.editor.view));
    };
    this.blurHandler = ({ event }) => {
      var _a;
      if (this.preventHide) {
        this.preventHide = false;
        return;
      }
      if ((event === null || event === void 0 ? void 0 : event.relatedTarget) && ((_a = this.element.parentNode) === null || _a === void 0 ? void 0 : _a.contains(event.relatedTarget))) {
        return;
      }
      if ((event === null || event === void 0 ? void 0 : event.relatedTarget) === this.editor.view.dom) {
        return;
      }
      this.hide();
    };
    this.tippyBlurHandler = (event) => {
      this.blurHandler({ event });
    };
    this.editor = editor;
    this.element = element;
    this.view = view;
    if (shouldShow) {
      this.shouldShow = shouldShow;
    }
    this.element.addEventListener("mousedown", this.mousedownHandler, { capture: true });
    this.editor.on("focus", this.focusHandler);
    this.editor.on("blur", this.blurHandler);
    this.tippyOptions = tippyOptions;
    this.element.remove();
    this.element.style.visibility = "visible";
  }
  createTooltip() {
    const { element: editorElement } = this.editor.options;
    const editorIsAttached = !!editorElement.parentElement;
    if (this.tippy || !editorIsAttached) {
      return;
    }
    this.tippy = tippy_esm_default(editorElement, {
      duration: 0,
      getReferenceClientRect: null,
      content: this.element,
      interactive: true,
      trigger: "manual",
      placement: "right",
      hideOnClick: "toggle",
      ...this.tippyOptions
    });
    if (this.tippy.popper.firstChild) {
      this.tippy.popper.firstChild.addEventListener("blur", this.tippyBlurHandler);
    }
  }
  update(view, oldState) {
    var _a, _b, _c;
    const { state } = view;
    const { doc, selection } = state;
    const { from, to } = selection;
    const isSame = oldState && oldState.doc.eq(doc) && oldState.selection.eq(selection);
    if (isSame) {
      return;
    }
    this.createTooltip();
    const shouldShow = (_a = this.shouldShow) === null || _a === void 0 ? void 0 : _a.call(this, {
      editor: this.editor,
      view,
      state,
      oldState
    });
    if (!shouldShow) {
      this.hide();
      return;
    }
    (_b = this.tippy) === null || _b === void 0 ? void 0 : _b.setProps({
      getReferenceClientRect: ((_c = this.tippyOptions) === null || _c === void 0 ? void 0 : _c.getReferenceClientRect) || (() => posToDOMRect(view, from, to))
    });
    this.show();
  }
  show() {
    var _a;
    (_a = this.tippy) === null || _a === void 0 ? void 0 : _a.show();
  }
  hide() {
    var _a;
    (_a = this.tippy) === null || _a === void 0 ? void 0 : _a.hide();
  }
  destroy() {
    var _a, _b;
    if ((_a = this.tippy) === null || _a === void 0 ? void 0 : _a.popper.firstChild) {
      this.tippy.popper.firstChild.removeEventListener("blur", this.tippyBlurHandler);
    }
    (_b = this.tippy) === null || _b === void 0 ? void 0 : _b.destroy();
    this.element.removeEventListener("mousedown", this.mousedownHandler, { capture: true });
    this.editor.off("focus", this.focusHandler);
    this.editor.off("blur", this.blurHandler);
  }
};
var FloatingMenuPlugin = (options) => {
  return new Plugin({
    key: typeof options.pluginKey === "string" ? new PluginKey(options.pluginKey) : options.pluginKey,
    view: (view) => new FloatingMenuView({ view, ...options })
  });
};
var FloatingMenu = Extension.create({
  name: "floatingMenu",
  addOptions() {
    return {
      element: null,
      tippyOptions: {},
      pluginKey: "floatingMenu",
      shouldShow: null
    };
  },
  addProseMirrorPlugins() {
    if (!this.options.element) {
      return [];
    }
    return [
      FloatingMenuPlugin({
        pluginKey: this.options.pluginKey,
        editor: this.editor,
        element: this.options.element,
        tippyOptions: this.options.tippyOptions,
        shouldShow: this.options.shouldShow
      })
    ];
  }
});

// node_modules/.pnpm/@tiptap+vue-3@2.0.0-beta.202_@tiptap+core@2.0.0-beta.202_@tiptap+pm@2.14.0_vue@3.5.16_typescript@5.8.3_/node_modules/@tiptap/vue-3/dist/tiptap-vue-3.esm.js
var BubbleMenu2 = defineComponent({
  name: "BubbleMenu",
  props: {
    pluginKey: {
      // TODO: TypeScript breaks :(
      // type: [String, Object as PropType<Exclude<BubbleMenuPluginProps['pluginKey'], string>>],
      type: null,
      default: "bubbleMenu"
    },
    editor: {
      type: Object,
      required: true
    },
    updateDelay: {
      type: Number,
      default: void 0
    },
    tippyOptions: {
      type: Object,
      default: () => ({})
    },
    shouldShow: {
      type: Function,
      default: null
    }
  },
  setup(props, { slots }) {
    const root = ref(null);
    onMounted(() => {
      const { updateDelay, editor, pluginKey, shouldShow, tippyOptions } = props;
      editor.registerPlugin(BubbleMenuPlugin({
        updateDelay,
        editor,
        element: root.value,
        pluginKey,
        shouldShow,
        tippyOptions
      }));
    });
    onBeforeUnmount(() => {
      const { pluginKey, editor } = props;
      editor.unregisterPlugin(pluginKey);
    });
    return () => {
      var _a;
      return h("div", { ref: root }, (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots));
    };
  }
});
function useDebouncedRef(value) {
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        value = newValue;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            trigger();
          });
        });
      }
    };
  });
}
var Editor2 = class extends Editor {
  constructor(options = {}) {
    super(options);
    this.vueRenderers = reactive(/* @__PURE__ */ new Map());
    this.contentComponent = null;
    this.reactiveState = useDebouncedRef(this.view.state);
    this.reactiveExtensionStorage = useDebouncedRef(this.extensionStorage);
    this.on("transaction", () => {
      this.reactiveState.value = this.view.state;
      this.reactiveExtensionStorage.value = this.extensionStorage;
    });
    return markRaw(this);
  }
  get state() {
    return this.reactiveState ? this.reactiveState.value : this.view.state;
  }
  get storage() {
    return this.reactiveExtensionStorage ? this.reactiveExtensionStorage.value : super.storage;
  }
  /**
   * Register a ProseMirror plugin.
   */
  registerPlugin(plugin, handlePlugins) {
    super.registerPlugin(plugin, handlePlugins);
    this.reactiveState.value = this.view.state;
  }
  /**
   * Unregister a ProseMirror plugin.
   */
  unregisterPlugin(nameOrPluginKey) {
    super.unregisterPlugin(nameOrPluginKey);
    this.reactiveState.value = this.view.state;
  }
};
var EditorContent = defineComponent({
  name: "EditorContent",
  props: {
    editor: {
      default: null,
      type: Object
    }
  },
  setup(props) {
    const rootEl = ref();
    const instance = getCurrentInstance();
    watchEffect(() => {
      const editor = props.editor;
      if (editor && editor.options.element && rootEl.value) {
        nextTick(() => {
          if (!rootEl.value || !editor.options.element.firstChild) {
            return;
          }
          const element = unref(rootEl.value);
          rootEl.value.append(...editor.options.element.childNodes);
          editor.contentComponent = instance.ctx._;
          editor.setOptions({
            element
          });
          editor.createNodeViews();
        });
      }
    });
    onBeforeUnmount(() => {
      const editor = props.editor;
      if (!editor) {
        return;
      }
      if (!editor.isDestroyed) {
        editor.view.setProps({
          nodeViews: {}
        });
      }
      editor.contentComponent = null;
      if (!editor.options.element.firstChild) {
        return;
      }
      const newElement = document.createElement("div");
      newElement.append(...editor.options.element.childNodes);
      editor.setOptions({
        element: newElement
      });
    });
    return { rootEl };
  },
  render() {
    const vueRenderers = [];
    if (this.editor) {
      this.editor.vueRenderers.forEach((vueRenderer) => {
        const node = h(Teleport, {
          to: vueRenderer.teleportElement,
          key: vueRenderer.id
        }, h(vueRenderer.component, {
          ref: vueRenderer.id,
          ...vueRenderer.props
        }));
        vueRenderers.push(node);
      });
    }
    return h("div", {
      ref: (el) => {
        this.rootEl = el;
      }
    }, ...vueRenderers);
  }
});
var FloatingMenu2 = defineComponent({
  name: "FloatingMenu",
  props: {
    pluginKey: {
      // TODO: TypeScript breaks :(
      // type: [String, Object as PropType<Exclude<FloatingMenuPluginProps['pluginKey'], string>>],
      type: null,
      default: "floatingMenu"
    },
    editor: {
      type: Object,
      required: true
    },
    tippyOptions: {
      type: Object,
      default: () => ({})
    },
    shouldShow: {
      type: Function,
      default: null
    }
  },
  setup(props, { slots }) {
    const root = ref(null);
    onMounted(() => {
      const { pluginKey, editor, tippyOptions, shouldShow } = props;
      editor.registerPlugin(FloatingMenuPlugin({
        pluginKey,
        editor,
        element: root.value,
        tippyOptions,
        shouldShow
      }));
    });
    onBeforeUnmount(() => {
      const { pluginKey, editor } = props;
      editor.unregisterPlugin(pluginKey);
    });
    return () => {
      var _a;
      return h("div", { ref: root }, (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots));
    };
  }
});
var NodeViewContent = defineComponent({
  props: {
    as: {
      type: String,
      default: "div"
    }
  },
  render() {
    return h(this.as, {
      style: {
        whiteSpace: "pre-wrap"
      },
      "data-node-view-content": ""
    });
  }
});
var NodeViewWrapper = defineComponent({
  props: {
    as: {
      type: String,
      default: "div"
    }
  },
  inject: ["onDragStart", "decorationClasses"],
  render() {
    var _a, _b;
    return h(this.as, {
      // @ts-ignore
      class: this.decorationClasses,
      style: {
        whiteSpace: "normal"
      },
      "data-node-view-wrapper": "",
      // @ts-ignore (https://github.com/vuejs/vue-next/issues/3031)
      onDragstart: this.onDragStart
    }, (_b = (_a = this.$slots).default) === null || _b === void 0 ? void 0 : _b.call(_a));
  }
});
var useEditor = (options = {}) => {
  const editor = shallowRef();
  onMounted(() => {
    editor.value = new Editor2(options);
  });
  onBeforeUnmount(() => {
    var _a;
    (_a = editor.value) === null || _a === void 0 ? void 0 : _a.destroy();
  });
  return editor;
};
var VueRenderer = class {
  constructor(component, { props = {}, editor }) {
    this.id = Math.floor(Math.random() * 4294967295).toString();
    this.editor = editor;
    this.component = markRaw(component);
    this.teleportElement = document.createElement("div");
    this.element = this.teleportElement;
    this.props = reactive(props);
    this.editor.vueRenderers.set(this.id, this);
    if (this.editor.contentComponent) {
      this.editor.contentComponent.update();
      if (this.teleportElement.children.length !== 1) {
        throw Error("VueRenderer doesn’t support multiple child elements.");
      }
      this.element = this.teleportElement.firstElementChild;
    }
  }
  get ref() {
    var _a;
    return (_a = this.editor.contentComponent) === null || _a === void 0 ? void 0 : _a.refs[this.id];
  }
  updateProps(props = {}) {
    Object.entries(props).forEach(([key, value]) => {
      this.props[key] = value;
    });
  }
  destroy() {
    this.editor.vueRenderers.delete(this.id);
  }
};
var nodeViewProps = {
  editor: {
    type: Object,
    required: true
  },
  node: {
    type: Object,
    required: true
  },
  decorations: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    required: true
  },
  extension: {
    type: Object,
    required: true
  },
  getPos: {
    type: Function,
    required: true
  },
  updateAttributes: {
    type: Function,
    required: true
  },
  deleteNode: {
    type: Function,
    required: true
  }
};
var VueNodeView = class extends NodeView {
  mount() {
    const props = {
      editor: this.editor,
      node: this.node,
      decorations: this.decorations,
      selected: false,
      extension: this.extension,
      getPos: () => this.getPos(),
      updateAttributes: (attributes = {}) => this.updateAttributes(attributes),
      deleteNode: () => this.deleteNode()
    };
    const onDragStart = this.onDragStart.bind(this);
    this.decorationClasses = ref(this.getDecorationClasses());
    const extendedComponent = defineComponent({
      extends: { ...this.component },
      props: Object.keys(props),
      template: this.component.template,
      setup: (reactiveProps) => {
        var _a, _b;
        provide("onDragStart", onDragStart);
        provide("decorationClasses", this.decorationClasses);
        return (_b = (_a = this.component).setup) === null || _b === void 0 ? void 0 : _b.call(_a, reactiveProps, {
          expose: () => void 0
        });
      },
      // add support for scoped styles
      // @ts-ignore
      // eslint-disable-next-line
      __scopeId: this.component.__scopeId,
      // add support for CSS Modules
      // @ts-ignore
      // eslint-disable-next-line
      __cssModules: this.component.__cssModules
    });
    this.renderer = new VueRenderer(extendedComponent, {
      editor: this.editor,
      props
    });
  }
  get dom() {
    if (!this.renderer.element.hasAttribute("data-node-view-wrapper")) {
      throw Error("Please use the NodeViewWrapper component for your node view.");
    }
    return this.renderer.element;
  }
  get contentDOM() {
    if (this.node.isLeaf) {
      return null;
    }
    const contentElement = this.dom.querySelector("[data-node-view-content]");
    return contentElement || this.dom;
  }
  update(node, decorations) {
    const updateProps = (props) => {
      this.decorationClasses.value = this.getDecorationClasses();
      this.renderer.updateProps(props);
    };
    if (typeof this.options.update === "function") {
      const oldNode = this.node;
      const oldDecorations = this.decorations;
      this.node = node;
      this.decorations = decorations;
      return this.options.update({
        oldNode,
        oldDecorations,
        newNode: node,
        newDecorations: decorations,
        updateProps: () => updateProps({ node, decorations })
      });
    }
    if (node.type !== this.node.type) {
      return false;
    }
    if (node === this.node && this.decorations === decorations) {
      return true;
    }
    this.node = node;
    this.decorations = decorations;
    updateProps({ node, decorations });
    return true;
  }
  selectNode() {
    this.renderer.updateProps({
      selected: true
    });
  }
  deselectNode() {
    this.renderer.updateProps({
      selected: false
    });
  }
  getDecorationClasses() {
    return this.decorations.map((item) => item.type.attrs.class).flat().join(" ");
  }
  destroy() {
    this.renderer.destroy();
  }
};
function VueNodeViewRenderer(component, options) {
  return (props) => {
    if (!props.editor.contentComponent) {
      return {};
    }
    return new VueNodeView(component, props, options);
  };
}
export {
  BubbleMenu2 as BubbleMenu,
  CommandManager,
  Editor2 as Editor,
  EditorContent,
  Extension,
  FloatingMenu2 as FloatingMenu,
  InputRule,
  Mark,
  Node,
  NodeView,
  NodeViewContent,
  NodeViewWrapper,
  PasteRule,
  Tracker,
  VueNodeViewRenderer,
  VueRenderer,
  callOrReturn,
  combineTransactionSteps,
  defaultBlockAt,
  escapeForRegEx,
  extensions,
  findChildren,
  findChildrenInRange,
  findParentNode,
  findParentNodeClosestToPos,
  generateHTML,
  generateJSON,
  generateText,
  getAttributes,
  getChangedRanges,
  getDebugJSON,
  getExtensionField,
  getHTMLFromFragment,
  getMarkAttributes,
  getMarkRange,
  getMarkType,
  getMarksBetween,
  getNodeAttributes,
  getNodeType,
  getSchema,
  getText,
  getTextBetween,
  getTextContentFromNodes,
  getTextSerializersFromSchema,
  inputRulesPlugin,
  isActive,
  isList,
  isMarkActive,
  isNodeActive,
  isNodeEmpty,
  isNodeSelection,
  isTextSelection,
  markInputRule,
  markPasteRule,
  mergeAttributes,
  nodeInputRule,
  nodePasteRule,
  nodeViewProps,
  pasteRulesPlugin,
  posToDOMRect,
  textInputRule,
  textPasteRule,
  textblockTypeInputRule,
  useEditor,
  wrappingInputRule
};
//# sourceMappingURL=@tiptap_vue-3.js.map
