/*
 * @Author: ykx
 * @Date: 2022-11-10 15:31:29
 * @LastEditTime: 2022-11-30 11:47:11
 * @LastEditors: your name
 * @Description:
 * @FilePath: \we-knowledge-base\src\components\document\editor\editor.ts
 */
import type { PropType, ExtractPropTypes } from 'vue'
import type { IDocument, IAuthority } from '@/types/module/document'
export const documentEditorProps = {
  
  document: {
    type: Object as PropType<IDocument>,
  },
  authority: {
    type: Object as PropType<IAuthority>,
  },
}

export type DocumentEditorProps = ExtractPropTypes<typeof documentEditorProps>;
