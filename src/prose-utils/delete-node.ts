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

  const { state } = editor;
  const $pos = state.selection.$anchor;

  if ($pos.depth) { // 这里有两个问题(不懂原理...)：图片扩展，block下 depth无image层， inline下指向了Paragraph，目前这里遍历的时候直接删除首层，不进行对比类型
    // for (let d = $pos.depth; d > 0; d--) {
    //   const node = $pos.node(d);
    //   console.log(node, d);
    //   if (node.type.name === nodeType) {
    //     // @ts-ignore
    //     if (editor.dispatchTransaction)
    //       // @ts-ignore
    //       editor.dispatchTransaction(state.tr.delete($pos.before(d), $pos.after(d)).scrollIntoView());
    //     return true;
    //   }
    // }
    const d = $pos.depth;
    const node = $pos.node(d);
    if (node) {
      // @ts-ignore
      if (editor.dispatchTransaction)
        // @ts-ignore
        editor.dispatchTransaction(state.tr.delete($pos.before(d), $pos.after(d)).scrollIntoView());
      return true;
    }
  } else {
    // @ts-ignore
    const node = state.selection.node;
    if (node && node.type.name === nodeType) {
      editor.chain().deleteSelection().run();
    }
  }

  return false;
}
