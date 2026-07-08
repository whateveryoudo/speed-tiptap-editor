/*
 * @Author: ykx
 * @Date: 2022-11-17 11:51:55
 * @LastEditTime: 2023-01-09 16:05:39
 * @LastEditors: your name
 * @Description:
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\link\modal.ts
 */
import { type ExtractPropTypes, PropType } from 'vue'
import { Editor } from '@tiptap/core'
export const linkModalProps = {
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
  visible: {
    type: Boolean,
    defalut: false,
  },
  text: {
    type: String,
    default: '',
  },
  href: {
    type: String,
    default: '',
  },
  from: {
    type: Number,
    default: 0,
  },
  to: {
    type: Number,
    default: 0,
  },
}

export type LinkModalProps = Partial<ExtractPropTypes<typeof linkModalProps> & { href: string }>
