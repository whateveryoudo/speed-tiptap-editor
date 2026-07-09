import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const ANTD_COMPONENTS = new Set([
  'Alert',
  'Anchor',
  'Button',
  'Card',
  'Checkbox',
  'ConfigProvider',
  'Divider',
  'Dropdown',
  'Empty',
  'Flex',
  'Form',
  'FormItem',
  'Input',
  'InputSearch',
  'Menu',
  'MenuDivider',
  'MenuItem',
  'Popover',
  'Progress',
  'Segmented',
  'Select',
  'SelectOption',
  'Space',
  'Spin',
  'Textarea',
  'Tooltip',
  'TypographyText',
])

function walkVueFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist') continue
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) walkVueFiles(fullPath, files)
    else if (entry.endsWith('.vue')) files.push(fullPath)
  }
  return files
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

function collectUsedComponents(template) {
  const used = new Set()
  const regex = /<\/?([A-Z][A-Za-z]*)/g
  let match
  while ((match = regex.exec(template)) !== null) {
    const name = match[1]
    if (ANTD_COMPONENTS.has(name)) used.add(name)
  }
  return [...used]
}

function parseNamedImports(content) {
  const match = content.match(/import\s+\{([^}]+)\}\s+from\s+['"]ant-design-vue['"]/)
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
    const merged = [...new Set([...parseNamedImports(content), ...unique])].sort()
    const nextImport = `import { ${merged.join(', ')} } from 'ant-design-vue'`
    return content.replace(importRegex, nextImport)
  }

  const scriptMatch = content.match(/<script[^>]*\ssetup(?:[\s>=]|[^>]*)*>/)
  if (!scriptMatch) return content
  const insertAt = scriptMatch.index + scriptMatch[0].length
  return `${content.slice(0, insertAt)}\nimport { ${unique.join(', ')} } from 'ant-design-vue'${content.slice(insertAt)}`
}

function fixFile(filePath) {
  const original = readFileSync(filePath, 'utf8')
  const template = getTemplateContent(original)
  if (!template) return false

  const used = collectUsedComponents(template)
  if (used.length === 0) return false

  const imported = parseNamedImports(original)
  const missing = used.filter((name) => !imported.includes(name))
  if (missing.length === 0) return false

  const next = upsertAntdImport(original, used)
  writeFileSync(filePath, next, 'utf8')
  console.log(`${filePath.replace(`${root}/`, '')}: +${missing.join(', ')}`)
  return true
}

const files = walkVueFiles(join(root, 'packages'))
let changed = 0
for (const file of files) {
  if (fixFile(file)) changed += 1
}
console.log(`\nFixed ${changed} files.`)
