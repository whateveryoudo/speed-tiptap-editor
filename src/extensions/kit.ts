/*
 * @Author: ykx
 * @Date: 2022-11-11 14:30:33
 * @LastEditTime: 2023-01-09 10:05:11
 * @LastEditors: your name
 * @Description: Tiptap 3.0 扩展配置
 * @FilePath: \we-knowledge-base\src\tiptap\editor\collaboration\kit.ts
 */

// 基础扩展
import { Title } from "./title";
import { Document as BaseDocument } from "./document";
import { Paragraph } from "./paragraph";
import { Image } from "./image";
import { Attachment } from "./attachment";
import { Placeholder, Focus } from "@tiptap/extensions";
import { StarterKit } from "@tiptap/starter-kit";
import type { Editor } from "@tiptap/core";
import { Dragable } from "./dragable";
import { Link } from "./link";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontSize } from "./fontSize";
import { Color } from "@tiptap/extension-color";
import { BackgroundColor } from "./backgroundColor";
import  FileHandler  from "./fileHandler";
import { Code } from "./code";
import { Parse } from "./parse";
import { Loading } from "./loading";
import { QuickInsert } from "./quickInsert";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { Blockquote } from "./blockquote";
import { Emoji } from "@tiptap/extension-emoji";
import { TextAlign } from "@tiptap/extension-text-align";
import { Tag } from "./tag";
import { Mind } from "./mind";
import { Mention } from "./mention";
import { CodeBlock } from "./codeBlock";
import CustomeFlowMap from "./flowMap/CustomeFlowMap";
import { Table, TableRow, TableHeader } from "@tiptap/extension-table";
import TableCell from "./tableCell";
import { TaskList } from "./taskList";
import { TaskItem } from "@tiptap/extension-list";
import { Indent } from "./indent";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";

const DocumentWithHeading = BaseDocument.extend({
  content: "title block+",
});

const placeholders = [
  "输入 / 唤起更多",
  // '使用 markdown 语法进行输入',
  "输入 @ 来提及他人",
  "输入 : 来插入表情",
  // '你知道吗？输入 $katex 然后在输入一个 $ 就可以快速插入数学公式，其他节点操作类似哦',
];

// 默认文档（无 title）
export const defauktKit = [
  // 使用 StarterKit 作为基础，禁用需要自定义的扩展
  StarterKit.configure({
    // 禁用一些扩展，因为我们要使用自定义版本
    document: false,
    paragraph: false,
    code: false,
    codeBlock: false,
    blockquote: false,
    horizontalRule: false,
    link: false,
    // paste: false  // 禁用默认的 paste 扩展，使用自定义的 Parse 扩展
    // 保留 StarterKit 中的其他扩展
    // bold, italic, strike, underline, link, heading, hardBreak, text
    // bulletList, orderedList, listItem, dropcursor, gapcursor, undoRedo, listKeymap, trailingNode
  }),

  // 自定义扩展
  Paragraph,
  Link,
  Placeholder.configure({
    placeholder: ({ node, editor, pos, hasAnchor }) => {
      if (node.type.name === "title") {
        console.log(editor.isEditable);
        return editor.isEditable ? "请输入标题" : "未命名文档";
      }
      if (node.type.name === "codeBlock") {
        return "";
      }

      if (!editor.isEditable) return "";
      // 这里不使用随机，比如选择颜色就会又执行这个方法导致placeholder一直变化
      return '输入 / 唤起更多';
    },
    showOnlyCurrent: false,
    showOnlyWhenEditable: false,
  }),
  Focus,
  Image.extend({
    draggable: false,
  }).configure({
    HTMLAttributes: {
      crossOrigin: "anonymous",
    },
  }),
  Attachment,
  FileHandler,
  BaseDocument, // 用普通的 document
  CustomeFlowMap,
  TextStyle.extend({
    priority: 1000,
  }),
  FontSize,
  Color,
  BackgroundColor,
  Mind,
  CodeBlock,
  Code,
  Loading,
  QuickInsert,
  HorizontalRule,
  Blockquote,
  Emoji,
  Parse,
  Mention,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  // 这里没使用tableKit,要扩展tableCell属性
  Table.configure({
    resizable: true,
    handleWidth: 5,
    lastColumnResizable: false,
  }),
  TableRow,
  TableHeader,
  TableCell,
  TaskList,
  TaskItem,
  Indent.configure({
    types: ['paragraph', 'heading', 'listItem'],
    minIndent: 0,
    maxIndent: 8,
  }),
  Superscript,
  Subscript,
  Tag,
];

// 知识库
export const knowledgeKit = [
  Title,
  DocumentWithHeading, // 用带 title 的 document
  ...defauktKit.filter(ext => ext?.name !== 'doc'),
];
