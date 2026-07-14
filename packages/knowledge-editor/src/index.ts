export { default as KnowledgeEditor } from './KnowledgeEditor.vue'
export {
  createKnowledgeEditorPlugins,
  type KnowledgeEditorPluginsOptions,
} from './createKnowledgeEditorPlugins'

export { knowledgeLayout, knowledgePreset } from './preset'
export { resolveToolbarKeys, resolveBubbleMenus } from '@speed-tiptap-editor/shared'
export {
  CollaborativeEditor,
  useCollaboration,
  buildCollaborationExtensions,
} from '@speed-tiptap-editor/collaboration-editor'
export type {
  CollaborationConfig,
  CollaborationUser,
  UseCollaborationOptions,
} from '@speed-tiptap-editor/collaboration-editor'
