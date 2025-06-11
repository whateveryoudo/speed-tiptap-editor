/*
 * @Author: ykx
 * @Date: 2022-11-30 19:30:18
 * @LastEditTime: 2022-11-30 19:47:37
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\orderedList.ts
 */
import { OrderedList as BuiltInOrderedList } from '@tiptap/extension-ordered-list';
import { getMarkdownSource } from '@/prose-utils';

export const OrderedList = BuiltInOrderedList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      parens: {
        default: false,
        parseHTML: (element) => /^[0-9]+\)/.test(getMarkdownSource(element)),
      },
    };
  },
});
