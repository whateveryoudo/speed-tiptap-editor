import type { Editor } from '@tiptap/core'

export const acceptedMimes = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/svg+xml'],
}

interface FnProps {
  file: File
  editor: Editor
}

export const handleFileEvent = ({ file, editor }: FnProps) => {
  if (!file) return false

  if (acceptedMimes.image.includes(file?.type)) {
    editor.commands.uploadImage(file)
    return true
  }
  editor.commands.uploadAttachment(file)
  return true
}
