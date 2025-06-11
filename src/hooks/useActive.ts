/*
 * @Author: ykx
 * @Date: 2022-11-18 11:42:45
 * @LastEditTime: 2022-11-18 14:28:37
 * @LastEditors: your name
 * @Description:
 * @FilePath: \we-knowledge-base\src\tiptap\core\hooks\useActive.ts
 */
import { Editor } from '@tiptap/core'
import { ref, watchEffect } from 'vue'
import { isEmpty } from 'lodash-es'
export const useActive = (editor: Editor, ...args: any) => {
  if (isEmpty(editor)) {
    return ref(false);
  }
  const active = ref(false)
  watchEffect(() => {
    const listener = () => {
      // eslint-disable-next-line prefer-spread
      active.value = editor.isActive.apply(editor, args)
    }

    editor.on('selectionUpdate', listener)
    editor.on('transaction', listener)

    return () => {
      editor.off('selectionUpdate', listener)
      editor.off('transaction', listener)
    }
  })

  return active
}
