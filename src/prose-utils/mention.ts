/*
 * @Author: ykx
 * @Date: 2022-11-11 15:38:08
 * @LastEditTime: 2022-11-11 16:09:57
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\prose-utils\mention.ts
 */
import { Editor } from '@tiptap/core';
import { Mention } from '@/extensions/mention';

export const findMentions = (editor: Editor) => {
  const content = editor.getJSON();
  const queue = [content];
  const res = [];

  while (queue.length) {
    const node = queue.shift();

    if (node.type === Mention.name) {
      res.push(node.attrs.id);
    }

    if (node.content && node.content.length) {
      queue.push(...node.content);
    }
  }

  return res;
};
