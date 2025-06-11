/*
 * @Author: ykx
 * @Date: 2022-11-30 19:26:00
 * @LastEditTime: 2022-12-05 10:29:22
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\bulletList.ts
 */
import { BulletList as BuiltInBulletList } from '@tiptap/extension-bullet-list';
import { getMarkdownSource } from '@/prose-utils';

export const BulletList = BuiltInBulletList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      bullet: {
        default: '*',
        parseHTML(element) {
          const bullet = getMarkdownSource(element)?.charAt(0);
          return '*+-'.includes(bullet) ? bullet : '*';
        },
      },
    };
  },
});
