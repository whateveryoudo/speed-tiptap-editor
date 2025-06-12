/*
 * @Author: ykx
 * @Date: 2022-11-22 19:38:48
 * @LastEditTime: 2022-12-05 15:16:34
 * @LastEditors: your name
 * @Description:
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\codeBlock\index.ts
 */

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
// import css from 'highlight.js/lib/languages/css'
// import js from 'highlight.js/lib/languages/javascript'
// import ts from 'highlight.js/lib/languages/typescript'
// import html from 'highlight.js/lib/languages/xml'
import Wrapper from './wrapper1.vue'
import { lowlight } from 'lowlight'

// lowlight.registerLanguage('html', html)
// lowlight.registerLanguage('css', css)
// lowlight.registerLanguage('js', js)
// lowlight.registerLanguage('ts', ts)

export const CodeBlock = CodeBlockLowlight.extend({
  name: 'codeBlock',
  content: 'inline*',
  group: 'block',
  addNodeView() {
    return VueNodeViewRenderer(Wrapper)
  },
}).configure({
  lowlight,
  defaultLanguage: 'auto',
})


