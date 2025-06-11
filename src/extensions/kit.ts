/*
 * @Author: ykx
 * @Date: 2022-11-11 14:30:33
 * @LastEditTime: 2023-01-09 10:05:11
 * @LastEditors: your name
 * @Description:
 * @FilePath: \we-knowledge-base\src\tiptap\editor\collaboration\kit.ts
 */

// 基础扩展
import { Title } from './title'
import { Document } from './document'
import { Paragraph } from './paragraph'
import { Image } from './image'
import { Attachment } from './attachment'
import { Placeholder } from './placeholder'
import type { Node } from 'prosemirror-model'
import Focus from '@tiptap/extension-focus'
import type { Editor } from '@tiptap/core'
import { Dragable } from './dragable'
import Underline from '@tiptap/extension-underline'
import { Link } from './link'
import TextStyle from '@tiptap/extension-text-style'
import { FontSize } from './fontSize'
import { Color } from '@tiptap/extension-color'
import { BackgroundColor } from './backgroundColor'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'

import { Code } from './code'
import { Parse } from './parse'
import { Loading } from './loading'
import { QuickInsert } from './quickInsert'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import { Blockquote } from './blockquote'
import { BulletList } from './bulletList'
import { OrderedList } from './orderedList'
import TaskItem from '@tiptap/extension-task-item'
import { TaskList } from './taskList'
import { Emoji } from './emoji'
import TextAlign from '@tiptap/extension-text-align'
import { Mind } from './mind'
import { Mention } from './mention'
import { CodeBlock } from './codeBlock'
import { TrailingNode } from './trailingNode'
import CustomeFlowMap from './flowMap/CustomeFlowMap'
import table from './table'
import tableRow from './tableRow'
import tableCell from './tableCell'
import tableHeader from './tableHeader'

const DocumentWithHeading = Document.extend({
  content: 'title block+',
})
const placeholders = [
  '输入 / 唤起更多',
  // '使用 markdown 语法进行输入',
  '输入 @ 来提及他人',
  '输入 : 来插入表情',
  // '你知道吗？输入 $katex 然后在输入一个 $ 就可以快速插入数学公式，其他节点操作类似哦',
]

export const CollaborationKit = [
  Paragraph,
  Underline,
  Link,
  Placeholder.configure({
    placeholder: ({ node, editor }: { node: Node; editor: Editor }) => {
      if (node.type.name === 'title') {
        return editor.isEditable ? '请输入标题' : '未命名文档'
      }
      if (node.type.name === 'codeBlock') {
        return ''
      }

      if (!editor.isEditable) return ''

      // return placeholders[~~(Math.random() * placeholders.length)]
      return placeholders[0]
    },
    showOnlyCurrent: false,
    showOnlyWhenEditable: false,
  }),
  Focus,
  Title,
  Image.extend({
    draggable: false,
  }).configure({
    HTMLAttributes: {
      crossOrigin: 'anonymous',
    },
  }),
  Attachment,
  DocumentWithHeading,
  // Dragable,
  CustomeFlowMap,
  TextStyle.extend({
    priority: 1000,
  }),
  FontSize,
  Color,
  BackgroundColor,
  Mind,
  CodeBlock,
  TrailingNode,
  Superscript,
  Subscript,
  Code,
  Loading,
  QuickInsert,
  HorizontalRule,
  Blockquote,
  BulletList,
  OrderedList,
  TaskItem,
  TaskList,
  Emoji,
  Parse,
  Mention,
  TextAlign.configure({
    types: ['heading', 'paragraph', 'image'],
  }),
  table,
  tableCell,
  tableRow,
  tableHeader,
]
