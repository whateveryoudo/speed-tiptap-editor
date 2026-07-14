import { StarterKit } from '@tiptap/starter-kit'
import { Title } from './nodes/title'
import { Image } from './nodes/image'
import { importTableExtensions } from './nodes/table'
import { importLink } from './marks/link'

/**
 * StarterKit v3 自带 link，导入时关掉，改用本包 Link（契约一致、可单独配置）。
 */
const importStarterKit = StarterKit.configure({
  link: false,
})

/** 轻量文档（首页等） */
export const liteKit = [importStarterKit, Title, importLink]

/**
 * 导入 / Markdown→JSON 子集：常见节点即可，不对齐全部自定义块（类语雀）。
 * Image + Table + Link：Word/Markdown 常见结构。
 */
export const importKit = [importStarterKit, Image, importLink, ...importTableExtensions]

/** 知识库全量契约的起点（后续可继续加无 UI 节点） */
export const knowledgeKit = [importStarterKit, Title, Image, importLink, ...importTableExtensions]

/** 导出用 */
export const exportKit = [importStarterKit, Title, Image, importLink, ...importTableExtensions]
