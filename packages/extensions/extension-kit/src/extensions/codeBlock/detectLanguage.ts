/**
 * 基于 lowlight.highlightAuto + 轻量启发式的语言检测：
 * 匹配不上 → 返回 null（调用方保持 plaintext）
 */

const UNSET_LANGS = new Set(['', 'plaintext', 'plain', 'text', 'txt', 'auto'])

/** 缩小候选集，降低 highlightAuto 误判 */
const DETECT_SUBSET = [
  'javascript',
  'typescript',
  'python',
  'bash',
  'shell',
  'xml',
  'css',
  'json',
  'java',
  'go',
  'sql',
  'yaml',
  'markdown',
  'c',
  'cpp',
  'rust',
  'php',
  'ruby',
  'kotlin',
  'swift',
]

/**
 * 短片段 highlightAuto 分数往往很低或为 0（如 `pnpm xxx`、`console.log`），
 * 用高频特征先兜一层。
 */
const HEURISTICS: { lang: string; re: RegExp }[] = [
  {
    lang: 'typescript',
    re: /\b(interface\s+\w+|type\s+\w+\s*=|:\s*(string|number|boolean|void|any)\b|as\s+const\b)/,
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
    lang: 'json',
    re: /^\s*[\{\[][\s\S]*[\}\]]\s*$/,
  },
  {
    lang: 'sql',
    re: /\b(SELECT|INSERT\s+INTO|UPDATE\s+\w+\s+SET|DELETE\s+FROM|CREATE\s+TABLE)\b/i,
  },
]

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

/**
 * @returns 检测到的语言 id，匹配不上返回 null
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
): string | null {
  const trimmed = text.trim()
  if (trimmed.length < MIN_LENGTH) return null

  const available = new Set(lowlight.listLanguages())
  const isRegistered = (lang: string) =>
    available.has(lang) || Boolean(lowlight.registered?.(lang))

  const heuristic = detectByHeuristic(trimmed)
  if (heuristic && isRegistered(heuristic)) return heuristic

  const subset = DETECT_SUBSET.filter((lang) => isRegistered(lang))
  const result = lowlight.highlightAuto(
    trimmed,
    subset.length ? { subset } : undefined,
  )
  const lang = result?.data?.language
  const relevance = result?.data?.relevance ?? 0

  if (!lang || relevance < MIN_RELEVANCE) return null
  if (UNSET_LANGS.has(lang.toLowerCase())) return null
  if (!isRegistered(lang)) return null

  return lang
}
