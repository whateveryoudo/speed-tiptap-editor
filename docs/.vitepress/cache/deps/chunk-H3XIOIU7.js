import {
  escapeForRegEx
} from "./chunk-SBH6O76G.js";
import {
  Decoration,
  DecorationSet
} from "./chunk-RAHEMUA5.js";
import {
  Plugin,
  PluginKey
} from "./chunk-YFHF347W.js";

// node_modules/.pnpm/@tiptap+suggestion@2.14.0_@tiptap+core@2.0.0-beta.202_@tiptap+pm@2.14.0/node_modules/@tiptap/suggestion/dist/index.js
function findSuggestionMatch(config) {
  var _a;
  const { char, allowSpaces: allowSpacesOption, allowToIncludeChar, allowedPrefixes, startOfLine, $position } = config;
  const allowSpaces = allowSpacesOption && !allowToIncludeChar;
  const escapedChar = escapeForRegEx(char);
  const suffix = new RegExp(`\\s${escapedChar}$`);
  const prefix = startOfLine ? "^" : "";
  const finalEscapedChar = allowToIncludeChar ? "" : escapedChar;
  const regexp = allowSpaces ? new RegExp(`${prefix}${escapedChar}.*?(?=\\s${finalEscapedChar}|$)`, "gm") : new RegExp(`${prefix}(?:^)?${escapedChar}[^\\s${finalEscapedChar}]*`, "gm");
  const text = ((_a = $position.nodeBefore) === null || _a === void 0 ? void 0 : _a.isText) && $position.nodeBefore.text;
  if (!text) {
    return null;
  }
  const textFrom = $position.pos - text.length;
  const match = Array.from(text.matchAll(regexp)).pop();
  if (!match || match.input === void 0 || match.index === void 0) {
    return null;
  }
  const matchPrefix = match.input.slice(Math.max(0, match.index - 1), match.index);
  const matchPrefixIsAllowed = new RegExp(`^[${allowedPrefixes === null || allowedPrefixes === void 0 ? void 0 : allowedPrefixes.join("")}\0]?$`).test(matchPrefix);
  if (allowedPrefixes !== null && !matchPrefixIsAllowed) {
    return null;
  }
  const from = textFrom + match.index;
  let to = from + match[0].length;
  if (allowSpaces && suffix.test(text.slice(to - 1, to + 1))) {
    match[0] += " ";
    to += 1;
  }
  if (from < $position.pos && to >= $position.pos) {
    return {
      range: {
        from,
        to
      },
      query: match[0].slice(char.length),
      text: match[0]
    };
  }
  return null;
}
var SuggestionPluginKey = new PluginKey("suggestion");
function Suggestion({ pluginKey = SuggestionPluginKey, editor, char = "@", allowSpaces = false, allowToIncludeChar = false, allowedPrefixes = [" "], startOfLine = false, decorationTag = "span", decorationClass = "suggestion", command = () => null, items = () => [], render = () => ({}), allow = () => true, findSuggestionMatch: findSuggestionMatch$1 = findSuggestionMatch }) {
  let props;
  const renderer = render === null || render === void 0 ? void 0 : render();
  const plugin = new Plugin({
    key: pluginKey,
    view() {
      return {
        update: async (view, prevState) => {
          var _a, _b, _c, _d, _e, _f, _g;
          const prev = (_a = this.key) === null || _a === void 0 ? void 0 : _a.getState(prevState);
          const next = (_b = this.key) === null || _b === void 0 ? void 0 : _b.getState(view.state);
          const moved = prev.active && next.active && prev.range.from !== next.range.from;
          const started = !prev.active && next.active;
          const stopped = prev.active && !next.active;
          const changed = !started && !stopped && prev.query !== next.query;
          const handleStart = started || moved && changed;
          const handleChange = changed || moved;
          const handleExit = stopped || moved && changed;
          if (!handleStart && !handleChange && !handleExit) {
            return;
          }
          const state = handleExit && !handleStart ? prev : next;
          const decorationNode = view.dom.querySelector(`[data-decoration-id="${state.decorationId}"]`);
          props = {
            editor,
            range: state.range,
            query: state.query,
            text: state.text,
            items: [],
            command: (commandProps) => {
              return command({
                editor,
                range: state.range,
                props: commandProps
              });
            },
            decorationNode,
            // virtual node for popper.js or tippy.js
            // this can be used for building popups without a DOM node
            clientRect: decorationNode ? () => {
              var _a2;
              const { decorationId } = (_a2 = this.key) === null || _a2 === void 0 ? void 0 : _a2.getState(editor.state);
              const currentDecorationNode = view.dom.querySelector(`[data-decoration-id="${decorationId}"]`);
              return (currentDecorationNode === null || currentDecorationNode === void 0 ? void 0 : currentDecorationNode.getBoundingClientRect()) || null;
            } : null
          };
          if (handleStart) {
            (_c = renderer === null || renderer === void 0 ? void 0 : renderer.onBeforeStart) === null || _c === void 0 ? void 0 : _c.call(renderer, props);
          }
          if (handleChange) {
            (_d = renderer === null || renderer === void 0 ? void 0 : renderer.onBeforeUpdate) === null || _d === void 0 ? void 0 : _d.call(renderer, props);
          }
          if (handleChange || handleStart) {
            props.items = await items({
              editor,
              query: state.query
            });
          }
          if (handleExit) {
            (_e = renderer === null || renderer === void 0 ? void 0 : renderer.onExit) === null || _e === void 0 ? void 0 : _e.call(renderer, props);
          }
          if (handleChange) {
            (_f = renderer === null || renderer === void 0 ? void 0 : renderer.onUpdate) === null || _f === void 0 ? void 0 : _f.call(renderer, props);
          }
          if (handleStart) {
            (_g = renderer === null || renderer === void 0 ? void 0 : renderer.onStart) === null || _g === void 0 ? void 0 : _g.call(renderer, props);
          }
        },
        destroy: () => {
          var _a;
          if (!props) {
            return;
          }
          (_a = renderer === null || renderer === void 0 ? void 0 : renderer.onExit) === null || _a === void 0 ? void 0 : _a.call(renderer, props);
        }
      };
    },
    state: {
      // Initialize the plugin's internal state.
      init() {
        const state = {
          active: false,
          range: {
            from: 0,
            to: 0
          },
          query: null,
          text: null,
          composing: false
        };
        return state;
      },
      // Apply changes to the plugin state from a view transaction.
      apply(transaction, prev, _oldState, state) {
        const { isEditable } = editor;
        const { composing } = editor.view;
        const { selection } = transaction;
        const { empty, from } = selection;
        const next = { ...prev };
        next.composing = composing;
        if (isEditable && (empty || editor.view.composing)) {
          if ((from < prev.range.from || from > prev.range.to) && !composing && !prev.composing) {
            next.active = false;
          }
          const match = findSuggestionMatch$1({
            char,
            allowSpaces,
            allowToIncludeChar,
            allowedPrefixes,
            startOfLine,
            $position: selection.$from
          });
          const decorationId = `id_${Math.floor(Math.random() * 4294967295)}`;
          if (match && allow({
            editor,
            state,
            range: match.range,
            isActive: prev.active
          })) {
            next.active = true;
            next.decorationId = prev.decorationId ? prev.decorationId : decorationId;
            next.range = match.range;
            next.query = match.query;
            next.text = match.text;
          } else {
            next.active = false;
          }
        } else {
          next.active = false;
        }
        if (!next.active) {
          next.decorationId = null;
          next.range = { from: 0, to: 0 };
          next.query = null;
          next.text = null;
        }
        return next;
      }
    },
    props: {
      // Call the keydown hook if suggestion is active.
      handleKeyDown(view, event) {
        var _a;
        const { active, range } = plugin.getState(view.state);
        if (!active) {
          return false;
        }
        return ((_a = renderer === null || renderer === void 0 ? void 0 : renderer.onKeyDown) === null || _a === void 0 ? void 0 : _a.call(renderer, { view, event, range })) || false;
      },
      // Setup decorator on the currently active suggestion.
      decorations(state) {
        const { active, range, decorationId } = plugin.getState(state);
        if (!active) {
          return null;
        }
        return DecorationSet.create(state.doc, [
          Decoration.inline(range.from, range.to, {
            nodeName: decorationTag,
            class: decorationClass,
            "data-decoration-id": decorationId
          })
        ]);
      }
    }
  });
  return plugin;
}

export {
  findSuggestionMatch,
  SuggestionPluginKey,
  Suggestion
};
//# sourceMappingURL=chunk-H3XIOIU7.js.map
