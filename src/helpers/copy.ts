/*
 * @Author: ykx
 * @Date: 2022-11-11 16:06:37
 * @LastEditTime: 2022-11-29 18:30:57
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\helpers\copy.ts
 */
import { message  } from 'ant-design-vue';

import _copy from './copy-to-clipboard';

export function copy(text: string | { text: string; format: string }[]) {
  return _copy(text, () => message.success('复制成功'));
}
