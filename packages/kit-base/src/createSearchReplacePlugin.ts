import type { SpeedEditorPlugin } from '@speed-tiptap-editor/shared'
import SearchReplaceModal from './overlays/SearchReplaceModal.vue'

export function createSearchReplacePlugin(): SpeedEditorPlugin {
  return {
    name: 'search-replace',
    extensions: [],
    overlays: [SearchReplaceModal],
  }
}
