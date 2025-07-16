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
import { lowlight } from 'lowlight'
import Wrapper from './Wrapper.vue'

// 导入常用的语言支持
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import php from 'highlight.js/lib/languages/php'
import ruby from 'highlight.js/lib/languages/ruby'
import go from 'highlight.js/lib/languages/go'
import rust from 'highlight.js/lib/languages/rust'
import sql from 'highlight.js/lib/languages/sql'
import bash from 'highlight.js/lib/languages/bash'
import yaml from 'highlight.js/lib/languages/yaml'
import xml from 'highlight.js/lib/languages/xml'

// 注册语言
lowlight.registerLanguage('html', html)
lowlight.registerLanguage('css', css)
lowlight.registerLanguage('js', js)
lowlight.registerLanguage('javascript', js)
lowlight.registerLanguage('ts', ts)
lowlight.registerLanguage('typescript', ts)
lowlight.registerLanguage('json', json)
lowlight.registerLanguage('md', markdown)
lowlight.registerLanguage('markdown', markdown)
lowlight.registerLanguage('py', python)
lowlight.registerLanguage('python', python)
lowlight.registerLanguage('java', java)
lowlight.registerLanguage('cpp', cpp)
lowlight.registerLanguage('csharp', csharp)
lowlight.registerLanguage('php', php)
lowlight.registerLanguage('ruby', ruby)
lowlight.registerLanguage('go', go)
lowlight.registerLanguage('rust', rust)
lowlight.registerLanguage('sql', sql)
lowlight.registerLanguage('bash', bash)
lowlight.registerLanguage('yaml', yaml)
lowlight.registerLanguage('xml', xml)

export const CodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return VueNodeViewRenderer(Wrapper)
  },
}).configure({
  lowlight,
  defaultLanguage: 'auto',
})


