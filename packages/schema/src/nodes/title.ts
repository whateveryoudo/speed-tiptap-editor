import { mergeAttributes, Node } from '@tiptap/core'

export interface TitleOptions {
  HTMLAttributes: Record<string, unknown>
}

export const TitleExtensionName = 'title'

export const Title = Node.create<TitleOptions>({
  name: TitleExtensionName,
  content: 'inline*',
  defining: true,
  isolating: true,
  marks: '',
  addOptions() {
    return {
      HTMLAttributes: {
        class: 'node-title',
      },
    }
  },
  parseHTML() {
    return [{ tag: 'h1[class=node-title]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['h1', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})
