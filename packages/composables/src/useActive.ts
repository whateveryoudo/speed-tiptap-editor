import type { Editor } from '@tiptap/core'
import { isEmpty } from 'lodash-es'
import { ref, watchEffect } from 'vue'

export function useActive(editor: Editor, ...args: unknown[]) {
  if (isEmpty(editor)) {
    return ref(false)
  }
  const active = ref(false)
  watchEffect((onCleanup) => {
    const listener = () => {
      active.value = editor.isActive(...(args as Parameters<Editor['isActive']>))
    }
    editor.on('selectionUpdate', listener)
    editor.on('transaction', listener)
    onCleanup(() => {
      editor.off('selectionUpdate', listener)
      editor.off('transaction', listener)
    })
  })
  return active
}
