import { findChildren } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import {
  detectCodeLanguage,
  isAutoDetectableLanguage,
} from './detectLanguage'

/**
 * 代码块内容变化时：若仍为 plaintext 且未手动选语言，
 * 用 highlightAuto 回写 language / languageAlias；匹配不上则保持 plaintext。
 */
export function LanguageDetectPlugin({
  name,
  lowlight,
}: {
  name: string
  lowlight: any
}) {
  return new Plugin({
    key: new PluginKey('codeBlockLanguageDetect'),
    appendTransaction(transactions, _oldState, newState) {
      if (!transactions.some((tr) => tr.docChanged)) return null

      let tr = newState.tr
      let modified = false

      const blocks = findChildren(
        newState.doc,
        (node) => node.type.name === name,
      )

      for (const { node, pos } of blocks) {
        const { language, languageAlias, languageManual } = node.attrs
        if (languageManual) continue

        const text = node.textContent

        // 清空内容：回到 plaintext，便于下次重新检测
        if (!text.trim()) {
          if (language !== 'plaintext' || languageAlias !== 'plaintext') {
            tr = tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              language: 'plaintext',
              languageAlias: 'plaintext',
            })
            modified = true
          }
          continue
        }

        if (!isAutoDetectableLanguage(languageAlias, language)) continue

        const detected = detectCodeLanguage(lowlight, text)
        if (!detected) continue
        if (detected === language && detected === languageAlias) continue

        tr = tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          language: detected,
          languageAlias: detected,
        })
        modified = true
      }

      return modified ? tr : null
    },
  })
}
