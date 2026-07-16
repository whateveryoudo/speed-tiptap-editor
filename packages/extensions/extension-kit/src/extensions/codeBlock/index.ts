/*
 * @Author: ykx
 * @Date: 2022-11-22 19:38:48
 * @LastEditTime: 2022-12-05 15:16:34
 * @LastEditors: your name
 * @Description: CodeBlock 扩展 - Tiptap 3.0 版本，使用官方 lowlight 扩展（这里gapcursor存在体验问题，拉下来源码修改为isolating: true, https://github.com/ueberdosis/tiptap/issues/1195）
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\codeBlock\index.ts
 */

import { CodeBlockLowlight } from "./codeBlockLowlightExtension";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import Wrapper from "./Wrapper.vue";
import { common, createLowlight } from "lowlight";
import { TextSelection } from "@tiptap/pm/state";
import { LanguageDetectPlugin } from "./languageDetectPlugin";
// import { Selection } from "@tiptap/pm/state";
// 添加一些其他语言

export const lowlightInstance = createLowlight(common);
// 关键：注册别名，这样这些值可直接用于 language
lowlightInstance.registerAlias({
  html: "xml",
  vue: "xml", // 没有官方 vue 解析器时，映射到 xml（模板部分）
  jsx: "javascript",
  tsx: "typescript",
});

export const CodeBlock = CodeBlockLowlight.extend({
  addOptions() {
      return {
      ...this.parent?.(),
    };
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      title: {
        default: null,
      },
      language: {
        default: "plaintext",
      },
      // 增加一个别名，用于存储语言的别名
      languageAlias: {
        default: "plaintext",
      },
      /** 用户手动选过语言后不再自动检测覆盖 */
      languageManual: {
        default: false,
      },
      wrap: {
        default: true,
      },
      theme: {
        default: "atom-one-light",
      },
      isExpanded: {
        default: true,
      },
      // null = 贴内容高度；用户拖拽底边后才写入具体 px
      height: {
        default: null,
      },
    };
  },
  addNodeView() {
    return VueNodeViewRenderer(Wrapper);
  },
  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() || []),
      LanguageDetectPlugin({
        name: this.name,
        lowlight: lowlightInstance,
      }),
    ];
  },
  addKeyboardShortcuts() {
    // 继承父级键盘快捷键
    const parent = (this as any).parent.call(this);

    return {
      ...parent,
      // 处理 Ctrl+A，确保只在 CodeBlock 内部全选
      "Mod-a": () => {
        const { state, dispatch } = this.editor.view;
        const { selection } = state;
        const { $from } = selection;

        // 检查是否在 CodeBlock 内部
        if ($from.parent.type.name === "codeBlock") {
          // 全选当前 CodeBlock 的内容
          const start = $from.start();
          const end = $from.end();
          const tr = state.tr.setSelection(
            TextSelection.create(state.doc, start, end)
          );
          dispatch(tr);
          return true;
        }
        return false;
      },
    };
  },
}).configure({
  defaultLanguage: "plaintext",
  lowlight: lowlightInstance,
});
