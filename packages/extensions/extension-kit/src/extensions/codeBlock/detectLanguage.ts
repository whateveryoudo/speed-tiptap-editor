/**
 * 基于 lowlight.highlightAuto + 轻量启发式的语言检测：
 * 匹配不上 → 返回 null（调用方保持 plaintext）
 */

const UNSET_LANGS = new Set(['', 'plaintext', 'plain', 'text', 'txt', 'auto'])

/**
 * Select 展示用别名 → lowlight 实际高亮语言
 *（与 CodeBlock registerAlias / Wrapper extendedLanguages 对齐）
 */
const ALIAS_TO_LANGUAGE: Record<string, string> = {
  html: 'xml',
  vue: 'xml',
  jsx: 'javascript',
  tsx: 'typescript',
}

/** 缩小候选集，降低 highlightAuto 误判 */
const DETECT_SUBSET = [
  'javascript',
  'typescript',
  'python',
  'bash',
  'shell',
  'xml',
  'css',
  'scss',
  'json',
  'java',
  'go',
  'sql',
  'yaml',
  'markdown',
  'c',
  'cpp',
  'csharp',
  'rust',
  'php',
  'ruby',
  'kotlin',
  'swift',
  'diff',
]

/**
 * 短片段 highlightAuto 分数往往很低或为 0，用高频特征先兜一层。
 * 更具体的规则放前面；lang 可为别名（vue/html/jsx/tsx）。
 */
const HEURISTICS: { lang: string; re: RegExp }[] = [
  {
    lang: 'vue',
    re: /<template\b[\s\S]*<\/template>|<script\s+setup\b/i,
  },
  {
    lang: 'tsx',
    re: /\b(React\.(FC|memo)|:\s*JSX\.Element\b)|<[A-Z][\w.]*(\s[^>]*)?\/?>/,
  },
  {
    lang: 'jsx',
    re: /\bReactDOM\b|React\.createElement\b|<[A-Z][\w.]*(\s[^>]*)?>[\s\S]*<\/[A-Z][\w.]*>/,
  },
  {
    lang: 'typescript',
    re: /\b(interface\s+\w+|type\s+\w+\s*=|:\s*(string|number|boolean|void|any)\b|as\s+const\b|enum\s+\w+)/,
  },
  {
    lang: 'javascript',
    re: /\b(console\.(log|error|warn|info|debug)|const\s+\w+|let\s+\w+|var\s+\w+|=>\s*[{(]|export\s+(default|const|function|\{)|import\s+.+from\s+|require\s*\()/,
  },
  {
    lang: 'python',
    re: /\b(def\s+\w+\s*\(|print\s*\(|from\s+\w+(\.\w+)*\s+import|import\s+\w+|if\s+__name__\s*==)/,
  },
  {
    lang: 'bash',
    re: /(^#!\/bin\/(ba)?sh\b)|(^\s*(pnpm|npm|yarn|npx|bun|git|cd|echo|export|curl|wget|chmod|sudo|mkdir|rm|cp|mv|cat|ls|brew|docker|kubectl)\b)/m,
  },
  {
    lang: 'go',
    re: /\b(package\s+\w+|func\s+\w+\s*\(|fmt\.Print)/,
  },
  {
    lang: 'rust',
    re: /\b(fn\s+\w+\s*\(|let\s+mut\s+|println!\s*\(|use\s+\w+::)/,
  },
  {
    lang: 'java',
    re: /\b(public\s+class\s+\w+|System\.out\.println|@Override)\b/,
  },
  {
    lang: 'csharp',
    re: /\b(using\s+System\b|namespace\s+\w+|Console\.Write)/,
  },
  {
    lang: 'cpp',
    re: /\b(#include\s*<|std::|cout\s*<<|int\s+main\s*\()/,
  },
  {
    lang: 'c',
    re: /\b(#include\s*<stdio\.h>|printf\s*\()/,
  },
  {
    lang: 'swift',
    re: /\b(import\s+Foundation|func\s+\w+\s*\([^)]*\)\s*->)/,
  },
  {
    lang: 'kotlin',
    re: /\b(fun\s+\w+\s*\(|val\s+\w+\s*=|println\s*\()/,
  },
  {
    lang: 'php',
    re: /^<\?php|\b(echo\s+|\$\w+\s*=)/m,
  },
  {
    lang: 'ruby',
    re: /\b(def\s+\w+|puts\s+|require\s+['"])/m,
  },
  {
    lang: 'scss',
    re: /\$[\w-]+\s*:|@(mixin|include|use|forward)\b/,
  },
  {
    lang: 'css',
    re: /[{;]\s*[\w-]+\s*:\s*[^;]+;|@(media|keyframes)\b/,
  },
  {
    lang: 'html',
    re: /<!DOCTYPE\s+html\b|<\/?(html|head|body|div|span|p|a|img|ul|li)\b/i,
  },
  {
    lang: 'xml',
    re: /<\?xml\b/,
  },
  {
    lang: 'yaml',
    re: /^---\s*$|^\s*[\w-]+\s*:\s+\S+/m,
  },
  {
    lang: 'json',
    re: /^\s*[\{\[][\s\S]*[\}\]]\s*$/,
  },
  {
    lang: 'sql',
    re: /\b(SELECT|INSERT\s+INTO|UPDATE\s+\w+\s+SET|DELETE\s+FROM|CREATE\s+TABLE)\b/i,
  },
  {
    lang: 'markdown',
    re: /^#{1,6}\s+\S+|^\s*[-*]\s+\S+|\[.+\]\(.+\)/m,
  },
  {
    lang: 'diff',
    re: /^(diff --git |@@ |\+\+\+ |--- )/m,
  },
]

export type DetectedLanguage = {
  /** lowlight / 高亮用 */
  language: string
  /** Select 回显用（可为 vue/html/jsx/tsx） */
  languageAlias: string
}

/** 是否仍允许自动检测（未手动指定、且当前为 plaintext/auto） */
export function isAutoDetectableLanguage(
  languageAlias: unknown,
  language: unknown,
): boolean {
  const alias = String(languageAlias ?? '').toLowerCase()
  const lang = String(language ?? '').toLowerCase()
  return UNSET_LANGS.has(alias) && UNSET_LANGS.has(lang)
}

const MIN_LENGTH = 8
/** highlightAuto 短代码分数偏低，2 即可采纳（启发式已先过滤明显片段） */
const MIN_RELEVANCE = 2

function detectByHeuristic(text: string): string | null {
  for (const { lang, re } of HEURISTICS) {
    if (re.test(text)) return lang
  }
  return null
}

function toDetected(lang: string): DetectedLanguage {
  const language = ALIAS_TO_LANGUAGE[lang] ?? lang
  return { language, languageAlias: lang }
}

/**
 * @returns 检测到的语言，匹配不上返回 null
 */
export function detectCodeLanguage(
  lowlight: {
    highlightAuto: (
      code: string,
      options?: { subset?: string[] },
    ) => { data?: { language?: string; relevance?: number } }
    listLanguages: () => string[]
    registered?: (name: string) => boolean
  },
  text: string,
): DetectedLanguage | null {
  const trimmed = text.trim()
  if (trimmed.length < MIN_LENGTH) return null

  const available = new Set(lowlight.listLanguages())
  const isHighlightable = (lang: string) => {
    const resolved = ALIAS_TO_LANGUAGE[lang] ?? lang
    return (
      available.has(resolved) ||
      Boolean(lowlight.registered?.(resolved)) ||
      Boolean(lowlight.registered?.(lang))
    )
  }

  const heuristic = detectByHeuristic(trimmed)
  if (heuristic && isHighlightable(heuristic)) {
    return toDetected(heuristic)
  }

  const subset = DETECT_SUBSET.filter((lang) => isHighlightable(lang))
  const result = lowlight.highlightAuto(
    trimmed,
    subset.length ? { subset } : undefined,
  )
  const lang = result?.data?.language
  const relevance = result?.data?.relevance ?? 0

  if (!lang || relevance < MIN_RELEVANCE) return null
  if (UNSET_LANGS.has(lang.toLowerCase())) return null
  if (!isHighlightable(lang)) return null

  return toDetected(lang)
}
