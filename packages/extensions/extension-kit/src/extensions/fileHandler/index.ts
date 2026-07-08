import FileHandler from "@tiptap/extension-file-handler";
export default FileHandler.configure({
  allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
  onDrop: (currentEditor, files, pos) => {
    files.forEach((file) => {
      if (
        ["image/png", "image/jpeg", "image/gif", "image/webp"].includes(
          file.type
        )
      ) {
        currentEditor.commands.uploadImage(file, pos);
      } else {
        currentEditor.commands.uploadAttachment(file, pos);
      }
    });
  },
  onPaste: (currentEditor, files) => {
    files.forEach((file) => {
      if (
        ["image/png", "image/jpeg", "image/gif", "image/webp"].includes(
          file.type
        )
      ) {
        currentEditor.commands.uploadImage(file);
      } else {
        currentEditor.commands.uploadAttachment(file);
      }
    });
  },
});
