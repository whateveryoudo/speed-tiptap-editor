import {
  Plugin,
  ReplaceAroundStep,
  canJoin,
  canSplit,
  findWrapping,
  liftTarget
} from "./chunk-YFHF347W.js";
import {
  Fragment,
  NodeRange,
  Slice
} from "./chunk-XMIMIZUL.js";

// node_modules/.pnpm/w3c-keyname@2.2.8/node_modules/w3c-keyname/index.js
var base = {
  8: "Backspace",
  9: "Tab",
  10: "Enter",
  12: "NumLock",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Meta",
  92: "Meta",
  106: "*",
  107: "+",
  108: ",",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Control",
  163: "Control",
  164: "Alt",
  165: "Alt",
  173: "-",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "'"
};
var shift = {
  48: ")",
  49: "!",
  50: "@",
  51: "#",
  52: "$",
  53: "%",
  54: "^",
  55: "&",
  56: "*",
  57: "(",
  59: ":",
  61: "+",
  173: "_",
  186: ":",
  187: "+",
  188: "<",
  189: "_",
  190: ">",
  191: "?",
  192: "~",
  219: "{",
  220: "|",
  221: "}",
  222: '"'
};
var mac = typeof navigator != "undefined" && /Mac/.test(navigator.platform);
var ie = typeof navigator != "undefined" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (i = 0; i < 10; i++) base[48 + i] = base[96 + i] = String(i);
var i;
for (i = 1; i <= 24; i++) base[i + 111] = "F" + i;
var i;
for (i = 65; i <= 90; i++) {
  base[i] = String.fromCharCode(i + 32);
  shift[i] = String.fromCharCode(i);
}
var i;
for (code in base) if (!shift.hasOwnProperty(code)) shift[code] = base[code];
var code;
function keyName(event) {
  var ignoreKey = mac && event.metaKey && event.shiftKey && !event.ctrlKey && !event.altKey || ie && event.shiftKey && event.key && event.key.length == 1 || event.key == "Unidentified";
  var name = !ignoreKey && event.key || (event.shiftKey ? shift : base)[event.keyCode] || event.key || "Unidentified";
  if (name == "Esc") name = "Escape";
  if (name == "Del") name = "Delete";
  if (name == "Left") name = "ArrowLeft";
  if (name == "Up") name = "ArrowUp";
  if (name == "Right") name = "ArrowRight";
  if (name == "Down") name = "ArrowDown";
  return name;
}

// node_modules/.pnpm/prosemirror-keymap@1.2.3/node_modules/prosemirror-keymap/dist/index.js
var mac2 = typeof navigator != "undefined" && /Mac|iP(hone|[oa]d)/.test(navigator.platform);
var windows = typeof navigator != "undefined" && /Win/.test(navigator.platform);
function normalizeKeyName(name) {
  let parts = name.split(/-(?!$)/), result = parts[parts.length - 1];
  if (result == "Space")
    result = " ";
  let alt, ctrl, shift2, meta;
  for (let i = 0; i < parts.length - 1; i++) {
    let mod = parts[i];
    if (/^(cmd|meta|m)$/i.test(mod))
      meta = true;
    else if (/^a(lt)?$/i.test(mod))
      alt = true;
    else if (/^(c|ctrl|control)$/i.test(mod))
      ctrl = true;
    else if (/^s(hift)?$/i.test(mod))
      shift2 = true;
    else if (/^mod$/i.test(mod)) {
      if (mac2)
        meta = true;
      else
        ctrl = true;
    } else
      throw new Error("Unrecognized modifier name: " + mod);
  }
  if (alt)
    result = "Alt-" + result;
  if (ctrl)
    result = "Ctrl-" + result;
  if (meta)
    result = "Meta-" + result;
  if (shift2)
    result = "Shift-" + result;
  return result;
}
function normalize(map) {
  let copy = /* @__PURE__ */ Object.create(null);
  for (let prop in map)
    copy[normalizeKeyName(prop)] = map[prop];
  return copy;
}
function modifiers(name, event, shift2 = true) {
  if (event.altKey)
    name = "Alt-" + name;
  if (event.ctrlKey)
    name = "Ctrl-" + name;
  if (event.metaKey)
    name = "Meta-" + name;
  if (shift2 && event.shiftKey)
    name = "Shift-" + name;
  return name;
}
function keymap(bindings) {
  return new Plugin({ props: { handleKeyDown: keydownHandler(bindings) } });
}
function keydownHandler(bindings) {
  let map = normalize(bindings);
  return function(view, event) {
    let name = keyName(event), baseName, direct = map[modifiers(name, event)];
    if (direct && direct(view.state, view.dispatch, view))
      return true;
    if (name.length == 1 && name != " ") {
      if (event.shiftKey) {
        let noShift = map[modifiers(name, event, false)];
        if (noShift && noShift(view.state, view.dispatch, view))
          return true;
      }
      if ((event.altKey || event.metaKey || event.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
      !(windows && event.ctrlKey && event.altKey) && (baseName = base[event.keyCode]) && baseName != name) {
        let fromCode = map[modifiers(baseName, event)];
        if (fromCode && fromCode(view.state, view.dispatch, view))
          return true;
      }
    }
    return false;
  };
}

// node_modules/.pnpm/prosemirror-schema-list@1.5.1/node_modules/prosemirror-schema-list/dist/index.js
function wrapInList(listType, attrs = null) {
  return function(state, dispatch) {
    let { $from, $to } = state.selection;
    let range = $from.blockRange($to);
    if (!range)
      return false;
    let tr = dispatch ? state.tr : null;
    if (!wrapRangeInList(tr, range, listType, attrs))
      return false;
    if (dispatch)
      dispatch(tr.scrollIntoView());
    return true;
  };
}
function wrapRangeInList(tr, range, listType, attrs = null) {
  let doJoin = false, outerRange = range, doc = range.$from.doc;
  if (range.depth >= 2 && range.$from.node(range.depth - 1).type.compatibleContent(listType) && range.startIndex == 0) {
    if (range.$from.index(range.depth - 1) == 0)
      return false;
    let $insert = doc.resolve(range.start - 2);
    outerRange = new NodeRange($insert, $insert, range.depth);
    if (range.endIndex < range.parent.childCount)
      range = new NodeRange(range.$from, doc.resolve(range.$to.end(range.depth)), range.depth);
    doJoin = true;
  }
  let wrap = findWrapping(outerRange, listType, attrs, range);
  if (!wrap)
    return false;
  if (tr)
    doWrapInList(tr, range, wrap, doJoin, listType);
  return true;
}
function doWrapInList(tr, range, wrappers, joinBefore, listType) {
  let content = Fragment.empty;
  for (let i = wrappers.length - 1; i >= 0; i--)
    content = Fragment.from(wrappers[i].type.create(wrappers[i].attrs, content));
  tr.step(new ReplaceAroundStep(range.start - (joinBefore ? 2 : 0), range.end, range.start, range.end, new Slice(content, 0, 0), wrappers.length, true));
  let found = 0;
  for (let i = 0; i < wrappers.length; i++)
    if (wrappers[i].type == listType)
      found = i + 1;
  let splitDepth = wrappers.length - found;
  let splitPos = range.start + wrappers.length - (joinBefore ? 2 : 0), parent = range.parent;
  for (let i = range.startIndex, e = range.endIndex, first = true; i < e; i++, first = false) {
    if (!first && canSplit(tr.doc, splitPos, splitDepth)) {
      tr.split(splitPos, splitDepth);
      splitPos += 2 * splitDepth;
    }
    splitPos += parent.child(i).nodeSize;
  }
  return tr;
}
function liftListItem(itemType) {
  return function(state, dispatch) {
    let { $from, $to } = state.selection;
    let range = $from.blockRange($to, (node) => node.childCount > 0 && node.firstChild.type == itemType);
    if (!range)
      return false;
    if (!dispatch)
      return true;
    if ($from.node(range.depth - 1).type == itemType)
      return liftToOuterList(state, dispatch, itemType, range);
    else
      return liftOutOfList(state, dispatch, range);
  };
}
function liftToOuterList(state, dispatch, itemType, range) {
  let tr = state.tr, end = range.end, endOfList = range.$to.end(range.depth);
  if (end < endOfList) {
    tr.step(new ReplaceAroundStep(end - 1, endOfList, end, endOfList, new Slice(Fragment.from(itemType.create(null, range.parent.copy())), 1, 0), 1, true));
    range = new NodeRange(tr.doc.resolve(range.$from.pos), tr.doc.resolve(endOfList), range.depth);
  }
  const target = liftTarget(range);
  if (target == null)
    return false;
  tr.lift(range, target);
  let $after = tr.doc.resolve(tr.mapping.map(end, -1) - 1);
  if (canJoin(tr.doc, $after.pos) && $after.nodeBefore.type == $after.nodeAfter.type)
    tr.join($after.pos);
  dispatch(tr.scrollIntoView());
  return true;
}
function liftOutOfList(state, dispatch, range) {
  let tr = state.tr, list = range.parent;
  for (let pos = range.end, i = range.endIndex - 1, e = range.startIndex; i > e; i--) {
    pos -= list.child(i).nodeSize;
    tr.delete(pos - 1, pos + 1);
  }
  let $start = tr.doc.resolve(range.start), item = $start.nodeAfter;
  if (tr.mapping.map(range.end) != range.start + $start.nodeAfter.nodeSize)
    return false;
  let atStart = range.startIndex == 0, atEnd = range.endIndex == list.childCount;
  let parent = $start.node(-1), indexBefore = $start.index(-1);
  if (!parent.canReplace(indexBefore + (atStart ? 0 : 1), indexBefore + 1, item.content.append(atEnd ? Fragment.empty : Fragment.from(list))))
    return false;
  let start = $start.pos, end = start + item.nodeSize;
  tr.step(new ReplaceAroundStep(start - (atStart ? 1 : 0), end + (atEnd ? 1 : 0), start + 1, end - 1, new Slice((atStart ? Fragment.empty : Fragment.from(list.copy(Fragment.empty))).append(atEnd ? Fragment.empty : Fragment.from(list.copy(Fragment.empty))), atStart ? 0 : 1, atEnd ? 0 : 1), atStart ? 0 : 1));
  dispatch(tr.scrollIntoView());
  return true;
}
function sinkListItem(itemType) {
  return function(state, dispatch) {
    let { $from, $to } = state.selection;
    let range = $from.blockRange($to, (node) => node.childCount > 0 && node.firstChild.type == itemType);
    if (!range)
      return false;
    let startIndex = range.startIndex;
    if (startIndex == 0)
      return false;
    let parent = range.parent, nodeBefore = parent.child(startIndex - 1);
    if (nodeBefore.type != itemType)
      return false;
    if (dispatch) {
      let nestedBefore = nodeBefore.lastChild && nodeBefore.lastChild.type == parent.type;
      let inner = Fragment.from(nestedBefore ? itemType.create() : null);
      let slice = new Slice(Fragment.from(itemType.create(null, Fragment.from(parent.type.create(null, inner)))), nestedBefore ? 3 : 1, 0);
      let before = range.start, after = range.end;
      dispatch(state.tr.step(new ReplaceAroundStep(before - (nestedBefore ? 3 : 1), after, before, after, slice, 1, true)).scrollIntoView());
    }
    return true;
  };
}

export {
  keymap,
  keydownHandler,
  wrapInList,
  liftListItem,
  sinkListItem
};
//# sourceMappingURL=chunk-QH2UD4OR.js.map
