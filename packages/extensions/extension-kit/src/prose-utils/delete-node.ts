/*
 * @Author: ykx
 * @Date: 2022-11-11 15:38:08
 * @LastEditTime: 2023-01-09 10:57:39
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\prose-utils\delete-node.ts
 */
import { Editor } from '@tiptap/core';

export function deleteNode(nodeType: string, editor: Editor) {
  const state = editor.state as any;
  const view = (editor as any).view;
  if (!state || !view) return false;

  const selection = state.selection as any;

  // 1) 如果是 NodeSelection，且命中目标类型，直接删除
  if ('node' in selection && selection.node && selection.node.type?.name === nodeType) {
    view.dispatch(state.tr.delete(selection.from, selection.to).scrollIntoView());
    return true;
  }

  const $pos = selection.$anchor;
  if (!$pos) return false;

  // 2) 处理内联 atom（如 p中包含image）：优先使用 nodeBefore / nodeAfter
  const before = $pos.nodeBefore as any;
  if (before && before.type?.name === nodeType) {
    const from = $pos.pos - before.nodeSize;
    const to = $pos.pos;
    view.dispatch(state.tr.delete(from, to).scrollIntoView());
    return true;
  }

  const after = $pos.nodeAfter as any;
  if (after && after.type?.name === nodeType) {
    const from = $pos.pos;
    const to = $pos.pos + after.nodeSize;
    view.dispatch(state.tr.delete(from, to).scrollIntoView());
    return true;
  }

  // 3) 回退到块级：向上寻找匹配的父节点并删除整个节点
  if ($pos.depth) {
    for (let d = $pos.depth; d > 0; d--) {
      const nodeAtDepth = $pos.node(d);
      if (nodeAtDepth?.type?.name === nodeType) {
        const from = $pos.before(d);
        const to = from + nodeAtDepth.nodeSize;
        view.dispatch(state.tr.delete(from, to).scrollIntoView());
        return true;
      }
    }
  }

  return false;
}
