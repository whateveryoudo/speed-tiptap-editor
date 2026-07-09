import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function walkVueFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist') continue
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      walkVueFiles(fullPath, files)
    } else if (entry.endsWith('.vue')) {
      files.push(fullPath)
    }
  }
  return files
}

const SPECIAL_TAGS = {
  'a-textarea': 'Textarea',
  'a-typography-text': 'TypographyText',
  'a-select-option': 'SelectOption',
  'a-input-search': 'InputSearch',
  'a-config-provider': 'ConfigProvider',
  'a-menu-item': 'MenuItem',
  'a-menu-divider': 'MenuDivider',
  'a-form-item': 'FormItem',
}

function tagToComponent(tag) {
  if (SPECIAL_TAGS[tag]) return SPECIAL_TAGS[tag]
  if (!tag.startsWith('a-')) return null
  return tag
    .slice(2)
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function getTemplateContent(content) {
  const scriptStart = content.search(/<script[\s>]/)
  const beforeScript = scriptStart > -1 ? content.slice(0, scriptStart) : content
  const openTag = '<template>'
  const closeTag = '</template>'
  const start = beforeScript.indexOf(openTag)
  const end = beforeScript.lastIndexOf(closeTag)
  if (start === -1 || end === -1 || end <= start) return ''
  return beforeScript.slice(start + openTag.length, end)
}

function collectTags(content) {
  const tags = new Set()
  const regex = /<\/?(a-[a-z][a-z0-9-]*)/gi
  let match
  while ((match = regex.exec(content)) !== null) {
    tags.add(match[1].toLowerCase())
  }
  return [...tags].map(tagToComponent).filter(Boolean)
}

function replaceTags(content, tagMap) {
  let next = content
  const entries = Object.entries(tagMap).sort((a, b) => b[0].length - a[0].length)
  for (const [tag, component] of entries) {
    const open = new RegExp(`<${tag}(?=\\s|>|/)`, 'gi')
    const close = new RegExp(`</${tag}>`, 'gi')
    next = next.replace(open, `<${component}`)
    next = next.replace(close, `</${component}>`)
  }
  return next
}

function parseNamedImports(importLine) {
  const match = importLine.match(/import\s+\{([^}]+)\}\s+from\s+['"]ant-design-vue['"]/)
  if (!match) return []
  return match[1]
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.split(/\s+as\s+/)[0].trim())
}

function upsertAntdImport(content, components) {
  const unique = [...new Set(components)].sort()
  if (unique.length === 0) return content

  const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]ant-design-vue['"]/
  const match = content.match(importRegex)

  if (match) {
    const existing = parseNamedImports(match[0])
    const merged = [...new Set([...existing, ...unique])].sort()
    const nextImport = `import { ${merged.join(', ')} } from 'ant-design-vue'`
    return content.replace(importRegex, nextImport)
  }

  const scriptMatch = content.match(/<script[^>]*\ssetup(?:[\s>=]|[^>]*)*>/)
  if (!scriptMatch) return content
  const insertAt = scriptMatch.index + scriptMatch[0].length
  const importLine = `\nimport { ${unique.join(', ')} } from 'ant-design-vue'`
  return content.slice(0, insertAt) + importLine + content.slice(insertAt)
}

function migrateFile(filePath) {
  const original = readFileSync(filePath, 'utf8')
  const templateContent = getTemplateContent(original)
  if (!templateContent) return false

  const tags = collectTags(templateContent)
  if (tags.length === 0) return false

  const tagMap = {}
  const uniqueTags = [...new Set([...original.matchAll(/<\/?(a-[a-z][a-z0-9-]*)/gi)].map((m) => m[1].toLowerCase()))]
  for (const tag of uniqueTags) {
    tagMap[tag] = tagToComponent(tag)
  }

  let next = replaceTags(original, tagMap)
  next = upsertAntdImport(next, tags)
  if (next === original) return false
  writeFileSync(filePath, next, 'utf8')
  return true
}

const files = walkVueFiles(join(root, 'packages'))

let changed = 0
for (const file of files) {
  if (migrateFile(file)) {
    changed += 1
    console.log(`updated: ${file.replace(`${root}/`, '')}`)
  }
}

console.log(`\nDone. Updated ${changed} files.`)
