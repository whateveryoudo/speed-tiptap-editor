/*
 * @Author: ykx
 * @Date: 2022-11-11 16:10:18
 * @LastEditTime: 2023-01-09 18:58:30
 * @LastEditors: your name
 * @Description: Mention 扩展 - 使用 floating-ui 替代 tippy.js
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\mention\index.ts
 */
import BulitInMention from '@tiptap/extension-mention'
import { getDatasetAttribute } from '@/prose-utils';

export const Mention = BulitInMention.extend({
  addAttributes() {
    return {
      userId: {
        default: '',
        parseHTML: getDatasetAttribute('user-id'),
      },
      label: {
        default: '',
        parseHTML: getDatasetAttribute('label'),
      },
      id: {
        default: '',
        parseHTML: getDatasetAttribute('id'),
      },
    };
  },
})
