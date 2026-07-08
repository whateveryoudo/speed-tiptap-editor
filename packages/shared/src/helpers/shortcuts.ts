export type Platform = 'mac' | 'windows' | 'linux' | 'unknown'

export const SHORTCUTS = {
  formatPainter: { mac: '⌘ + Shift + C', win: 'Ctrl + Shift + C' },
  clearNodeAndMarks: { mac: '⌘ + \\', win: 'Ctrl + \\' },
  textColor: { mac: '⌥ + ⌘ + C', win: 'Alt + Ctrl + C' },
  backgroundColor: { mac: '⌥ + ⌘ + H', win: 'Alt + Ctrl + H' },
  bold: { mac: '⌘ + B', win: 'Ctrl + B' },
  italic: { mac: '⌘ + I', win: 'Ctrl + I' },
  underline: { mac: '⌘ + U', win: 'Ctrl + U' },
  strike: { mac: '⌘ + Shift + S', win: 'Ctrl + Shift + S' },
  undo: { mac: '⌘ + Z', win: 'Ctrl + Z' },
  redo: { mac: 'Shift + ⌘ + Z', win: 'Ctrl + Y' },
  findAndReplace: { mac: '⌘ + F', win: 'Ctrl + F' },
} as const

export function detectPlatform(): Platform {
  if (typeof window === 'undefined') return 'unknown'
  const ua = window.navigator.userAgent.toLowerCase()
  if (ua.includes('mac')) return 'mac'
  if (ua.includes('win')) return 'windows'
  if (ua.includes('linux')) return 'linux'
  return 'unknown'
}

export function getShortcutTipByKey(keyMapKey: string): string {
  const target = SHORTCUTS[keyMapKey as keyof typeof SHORTCUTS]
  if (!target) return ''
  const platform = detectPlatform()
  return platform === 'mac' ? target.mac : target.win
}
