/*
 * @Author: ykx
 * @Date: 2022-11-22 19:38:48
 * @LastEditTime: 2022-12-05 15:16:34
 * @LastEditors: your name
 * @Description: CodeBlock 扩展 - Tiptap 3.0 版本，使用官方 lowlight 扩展
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\codeBlock\index.ts
 */

import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Wrapper from './Wrapper.vue'
import { common, createLowlight } from 'lowlight'
const lowlight = createLowlight(common)
export const CodeBlock = CodeBlockLowlight.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      title: {
        default: null,
      },
      language: {
        default: 'auto',
      },
      wrap: {
        default: true,
      },
      theme: {
        default: 'github-light',
      },
      height: {
        default: '266',
      },
    }
  },
  addNodeView() {
    return VueNodeViewRenderer(Wrapper)
  },
}).configure({
  lowlight,
  defaultLanguage: 'auto',
})


