import { Link as TiptapLink } from '@tiptap/extension-link'

/**
 * 无 UI 链接 mark：Word / Markdown→JSON 解析 `<a href>`。
 * 编辑器侧 Markdown `[text](url)` 输入规则在 extension-kit 中 extend。
 */
export const Link = TiptapLink

/** 导入用配置（不依赖点击打开） */
export const importLink = Link.configure({
  openOnClick: false,
  linkOnPaste: true,
  autolink: true,
})
