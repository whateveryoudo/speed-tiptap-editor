import type { Editor } from '@tiptap/core'
import { computed, unref, type MaybeRef } from 'vue'

/** 替代 useSpeedEditor().editableCpt，避免 kit-base 依赖 base-editor */
export function useEditorEditable(editor: MaybeRef<Editor | undefined>) {
  return computed(() => unref(editor)?.isEditable ?? false)
}
