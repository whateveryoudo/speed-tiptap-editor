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
import { Link } from "./link";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontSize } from "./fontSize";
import { Color } from "@tiptap/extension-color";
import { BackgroundColor } from "./backgroundColor";
import FileHandler from "./fileHandler";
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
import { Callout } from "./callout";
import CustomeFlowMap from "./flowMap/CustomeFlowMap";
import { Table, TableRow, TableHeader } from "@tiptap/extension-table";
import TableCell from "./tableCell";
import { TaskList } from "./taskList";
import { TaskItem } from "@tiptap/extension-list";
import { Indent } from "./indent";
import { SearchAndReplace } from "./searchAndReplace";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import { FormatPainter } from "./formatPainter";
import { DocumentSuggest, type Suggestion as DocumentSuggestion } from "./documentSuggest";
import { NodeId } from "./nodeId";
import { Decoration } from "@tiptap/pm/view";
import { ref } from "vue";

// 用于 DocumentSuggest 扩展与 Vue 组件之间共享 tooltip 容器
export const tooltipElement = ref<{
  element: HTMLElement;
  suggestion: DocumentSuggestion;
  ruleTitle: string;
} | null>(null);
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
export const getDefaultKit = (props: any) => [
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
    undoRedo: false,
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
        return editor.isEditable ? "请输入标题" : "未命名文档";
      }
      if (["codeBlock", "callout"].includes(node.type.name)) {
        return "";
      }

      if (!editor.isEditable) return "";
      // 这里不使用随机，比如选择颜色就会又执行这个方法导致placeholder一直变化
      return props.placeholder;
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
  Callout,
  Code,
  Loading,
  QuickInsert,
  HorizontalRule,
  Blockquote,
  Emoji,
  Parse,
  Mention,
  FormatPainter,
  // 开源 替换 搜索插件
  SearchAndReplace.configure({
    searchResultClass: "speed-tiptap-search-result",
    disableRegex: true,
  }),
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
    types: ["paragraph", "heading", "listItem"],
    minIndent: 0,
    maxIndent: 8,
  }),
  Superscript,
  Subscript,
  Tag,
  // NodeId,
];

// 知识库
export const getKnowledgeKit = (props: any) => [
  Title,
  DocumentWithHeading, // 用带 title 的 document
  DocumentSuggest.configure({
    backendUrl: 'http://localhost:8010/api/v1/ai/document/check',
    rules: props.documentSuggestConfig?.rules || [],
    // 自定义装饰器
    getCustomSuggestionDecoration({
      suggestion,
      ruleTitle,
      isSelected,
      range,
      getDefaultDecorations,
    }: {
      suggestion: DocumentSuggestion;
      ruleTitle: string;
      isSelected: boolean;
      range: { from: number; to: number };
      getDefaultDecorations: () => Decoration[];
    }) {
      const decorations = getDefaultDecorations();

      if (isSelected) {
        decorations.push(
          Decoration.widget(range.to, () => {
            const element = document.createElement("span");
            // 选中时，更新 tooltipElement
            tooltipElement.value = { element, suggestion, ruleTitle };
            return element;
          })
        );
      } else {
        // 如果当前取消选中的正好是 tooltip 上那条，清空 tooltip
        if (tooltipElement.value?.suggestion?.id === suggestion.id) {
          tooltipElement.value = null;
        }
      }

      return decorations;
    },
  }),
  ...getDefaultKit(props).filter((ext) => ext?.name !== "doc"),
];

