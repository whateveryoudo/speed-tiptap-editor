declare module 'html-to-docx' {
  const HTMLtoDOCX: (
    html: string,
    header?: unknown | null,
    options?: Record<string, unknown>
  ) => Promise<ArrayBuffer>;
  export default HTMLtoDOCX;
}


