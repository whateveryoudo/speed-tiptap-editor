import { Document } from '@tiptap/extension-document'

/** 知识库文档根：首子节点为 title */
export const DocumentKnowledge = Document.extend({
  content: 'title block+',
})
