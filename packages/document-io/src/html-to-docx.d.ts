declare module 'html-to-docx' {
  interface HtmlToDocxOptions {
    table?: { row?: { cantSplit?: boolean } }
    footer?: boolean
    pageNumber?: boolean
    font?: string
    fontSize?: number
    title?: string
    [key: string]: unknown
  }

  export default function htmlToDocx(
    html: string,
    headerHTML?: string | null,
    documentOptions?: HtmlToDocxOptions,
    footerHTML?: string | null,
  ): Promise<Blob | ArrayBuffer | Uint8Array>
}
