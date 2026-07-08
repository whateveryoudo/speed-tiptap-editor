import type { SpeedEditorPlugin } from '@speed-tiptap-editor/shared'
import DocumentSuggestOverlay from './overlays/DocumentSuggestOverlay.vue'

export function createDocumentSuggestOverlayPlugin(): SpeedEditorPlugin {
  return {
    name: 'document-suggest-overlay',
    extensions: [],
    overlays: [DocumentSuggestOverlay],
  }
}
