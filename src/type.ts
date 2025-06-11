/*
 * @Author: ykx
 * @Date: 2022-11-30 10:29:24
 * @LastEditTime: 2022-11-30 17:22:40
 * @LastEditors: your name
 * @Description:
 * @FilePath: \we-knowledge-base\src\tiptap\editor\collaboration\editor.ts
 */
import { PropType, ExtractPropTypes } from "vue";
export const collaborationEditorProps = {
  /**
   * 文档 id
   */
  docId: {
    type: String,
  },
  /**
   *  类型
   */
  docType: {
    type: String as PropType<"document" | "template">,
    default: "document",
  },
  /**
   * 是否可编辑
   */
  editable: {
    type: Boolean,
    default: true,
  },

  /**
   * 是否需要菜单
   */
  menubar: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否隐藏评论功能
   */
  hideComment: {
    type: Boolean,
    default: true,
  },
  hocuspocusProvider: {
    type: Object,
  },
};
export type CollaborationEditorProps = ExtractPropTypes<
  typeof collaborationEditorProps
>;
