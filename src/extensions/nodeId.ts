// extensions/nodeId.ts
import { Extension } from '@tiptap/core'
import { nanoid } from 'nanoid'

export const NodeId = Extension.create({
  name: 'nodeId',

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading', 'bulletList', 'orderedList', 'listItem', 'blockquote', 'codeBlock'], // add every node you care about
        attributes: {
          nodeId: {
            default: null,
            parseHTML: element => element.getAttribute('data-node-id') ?? nanoid(8),
            renderHTML: attributes => {
              if (!attributes.nodeId) return {}
              return { 'data-node-id': attributes.nodeId }
            },
          },
        },
      },
    ]
  },
})