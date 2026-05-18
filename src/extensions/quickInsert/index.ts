/*
 * @Author: ykx
 * @Date: 2022-12-08 14:46:22
 * @LastEditTime: 2022-12-29 10:48:25
 * @LastEditors: your name
 * @Description: QuickInsert 扩展 - 使用 floating-ui 替代 tippy.js
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\quickInsert\index.ts
 */
import { Node } from "@tiptap/core";
import { PluginKey, Plugin } from "@tiptap/pm/state";
import { EXTENSION_PRIORITY_HIGHEST } from "@st/enums/constants";
import Suggestion from "@tiptap/suggestion";
import BaseList from "@st/menus/insert/baseList";
import { useCommand, type SubMenuGroup } from "@st/menus/insert/useCommand";
import { VueRenderer } from "@tiptap/vue-3";
import { useFloatingPopup } from "@st/hooks/useFloatingPopup";

const QuickInsertPluginKey = new PluginKey("quickInsert");
const QuickInsertPluginKeyZh = new PluginKey("zhEvokeMenuPlaceholder");
const QuickInsertPluginKeyEn = new PluginKey("enEvokeMenuPlaceholder");

const extensionName = "quickInsert";
const { menuGroup } = useCommand();

export const QuickInsert = Node.create({
  name: extensionName,

  priority: EXTENSION_PRIORITY_HIGHEST,
 
  addOptions() {
    return {
      HTMLAttributes: {},
      suggestion: {
        char: "/",
        pluginKey: QuickInsertPluginKey,
        command: ({
          editor,
          range,
          props,
        }: {
          editor: any;
          range: any;
          props: any;
        }) => {
          const { state, dispatch } = editor.view;
          // 直接使用传入的 range 精确删除触发串（支持中英文触发符）
          const tr = state.tr.deleteRange(range.from, range.to);
          dispatch(tr);
          props?.action(editor, props.payload);

          editor?.view?.focus();
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      // 英文 '/'
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        pluginKey: QuickInsertPluginKeyEn,
      }),
      // 中文全角 '／'
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        char: "、",
        pluginKey: QuickInsertPluginKeyZh,
      }),
    ];
  },
  // 此方案不行，内部会直接不触发command(挺难复写的)
  // addKeyboardShortcuts() {
  //   const triggerAtCaret = () => {
  //     // this.editor.storage[extensionName].forceOpen = true;
  //     this.editor
  //       .chain()
  //       .focus()
  //       .insertContent('/')
  //       .run();
  //     return true;
  //   };

  //   return {
  //     'Mod-/': triggerAtCaret,
  //     'Mod-\\': triggerAtCaret,
  //   } as any;
  // },
  


  addStorage() {
    return {
      rect: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    };
  },
}).configure({
  suggestion: {
    // 这里只返回全量项(搜索操作是在组件内部执行)
    items: ({ query }: any) => {
      return menuGroup.value;
    },
    // (修改为光标后面不能有内容，不拦截前面了，这样无法在文本中间触发插入，而且插件默认会匹配 ' ' + \)
    allow: (props: any) => {
      const { editor, state, range } = props;
      const $from = state.doc.resolve(range.from);
      // 光标后面不能有内容
      const trailing = state.doc.textBetween(range.to, $from.end(), '\n').trim();

      return trailing.length === 0;
    },
    render: () => {
      let component: any;
      const { showPopup, updatePopupPosition, hidePopup } = useFloatingPopup({
        placement: "bottom-start",
        offset: 4,
        padding: 8,
      });

      return {
        onStart: (props: any) => {
          const isEditable = props.editor.isEditable;
          if (!isEditable) return;
          // 兜底重置快捷键触发标记
          ((props.editor.storage as any)[extensionName]).forceOpen = false;
          component = new VueRenderer(BaseList, {
            props: { ...props, triggerType: "bubble" },
            editor: props.editor,
          });
          showPopup(component, props.clientRect);
        },

        onUpdate: (props: any) => {
          const isEditable = props.editor.isEditable;
          if (!isEditable) return;

          component.updateProps(props);

          props.editor.storage[extensionName].rect = props.clientRect();

          updatePopupPosition(props.clientRect);
        },

        onKeyDown: (props: any) => {
          if (props.event.key === "Escape") {
            hidePopup();
            return true;
          }
          return component.ref?.onKeyDown(props);
        },

        onExit: (props: any) => {
          hidePopup();
          // 兜底重置快捷键触发标记
          ((props.editor.storage as any)[extensionName]).forceOpen = false;
          component.destroy();
        },
      };
    },
  },
});
