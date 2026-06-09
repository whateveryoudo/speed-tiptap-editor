import { getLiteKit } from '@st/extensions/kit'
import type { EditorPreset } from './types'

export const litePreset: EditorPreset = {
  name: 'lite',
  getExtensions: (props) => getLiteKit(props),
  toolbar: [
    'undo', 'redo', 'clearNodeAndMarks',
    '|',
    'heading', 'fontSize', 'bold', 'italic', 'underline', 'strike',
    '|',
    'textColor', 'backgroundColor',
    '|',
    'image',
    'file',
    'table',
    '|',
    'align',
    '|',
    'bulletList', 'orderedList', 'taskList',
    '|',
    'indent',
    '|',
    'emoji',
    '|',
    'blockquote', 'horizontalRule',
  ],
  bubbleMenus: ['text', 'image', 'attachment', 'table', 'callout'],
  features: {
    hasTitle: false,
    hasDragHandle: false,
    contentMode: 'html',
    showDocumentSuggest: false,
    showSearchReplace: false,
  },
}
