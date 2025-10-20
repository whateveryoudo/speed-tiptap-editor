/**
 * 平台检测工具函数
 */

export type Platform = 'mac' | 'windows' | 'linux' | 'unknown'
/**
 * 常用快捷键组合
 */
export const SHORTCUTS = {
    // —— Essentials ——
    copy: {
        mac: '⌘ + C',
        win: 'Ctrl + C'
    },
    cut: {
        mac: '⌘ + X',
        win: 'Ctrl + X'
    },
    paste: {
        mac: '⌘ + V',
        win: 'Ctrl + V'
    },
    pasteWithoutFormatting: {
        mac: '⌘ + Shift + V',
        win: 'Ctrl + Shift + V'
    },
    addLineBreak: {
        // Tiptap: Shift + Enter 或 ⌘/Ctrl + Enter
        mac: 'Shift + Enter 或 ⌘ + Enter',
        win: 'Shift + Enter 或 Ctrl + Enter'
    },
    // 字体颜色
    textColor: {
        mac: '⌥ + ⌘ + C',
        win: 'Alt + Ctrl + C'
    },
    // 背景颜色
    backgroundColor: {
        mac: '⌥ + ⌘ + H',
        win: 'Alt + Ctrl + H'
    },
    // 粗体
    bold: {
        mac: '⌘ + B',
        win: 'Ctrl + B'
    },
    // 斜体
    italic: {
        mac: '⌘ + I',
        win: 'Ctrl + I'
    },
    // 下划线（Tiptap 默认）
    underline: {
        mac: '⌘ + U',
        win: 'Ctrl + U'
    },
    // 删除线（Tiptap 默认：Shift + Mod + S）
    strike: {
        mac: '⌘ + Shift + S',
        win: 'Ctrl + Shift + S'
    },
    // 高亮（Tiptap 默认）
    highlight: {
        mac: '⌘ + Shift + H',
        win: 'Ctrl + Shift + H'
    },
    // 行内代码（mark，Tiptap 默认）
    code: {
        mac: '⌘ + E',
        win: 'Ctrl + E'
    },
    // 清除格式
    clear: {
        mac: "⌘ + \\",
        win: "Ctrl + \\"
    },
    // 撤销
    undo: {
        mac: '⌘ + Z',
        win: 'Ctrl + Z'
    },
    // 重做
    redo: {
        mac: 'Shift + ⌘ + Z',
        win: 'Ctrl + Y'
    },
    // —— 段落/块级格式 ——
    normalText: {
        mac: '⌘ + Alt + 0',
        win: 'Ctrl + Alt + 0'
    },
    heading1: {
        mac: '⌘ + Alt + 1',
        win: 'Ctrl + Alt + 1'
    },
    heading2: {
        mac: '⌘ + Alt + 2',
        win: 'Ctrl + Alt + 2'
    },
    heading3: {
        mac: '⌘ + Alt + 3',
        win: 'Ctrl + Alt + 3'
    },
    heading4: {
        mac: '⌘ + Alt + 4',
        win: 'Ctrl + Alt + 4'
    },
    heading5: {
        mac: '⌘ + Alt + 5',
        win: 'Ctrl + Alt + 5'
    },
    heading6: {
        mac: '⌘ + Alt + 6',
        win: 'Ctrl + Alt + 6'
    },
    // 无序列表（Bullet list）
    unorderedList: {
        mac: 'Shift + ⌘ + 8',
        win: 'Ctrl + Shift + 8'
    },
    // 有序列表（Ordered list）
    orderedList: {
        mac: 'Shift + ⌘ + 7',
        win: 'Ctrl + Shift + 7'
    },
    // 任务列表
    taskList: {
        mac: '⌘ + Shift + 9',
        win: 'Ctrl + Shift + 9'
    },
    // 引用块
    blockquote: {
        mac: '⌘ + Shift + B',
        win: 'Ctrl + Shift + B'
    },
    // 对齐
    alignLeft: {
        mac: '⌘ + Shift + L',
        win: 'Ctrl + Shift + L'
    },
    alignCenter: {
        mac: '⌘ + Shift + E',
        win: 'Ctrl + Shift + E'
    },
    alignRight: {
        mac: '⌘ + Shift + R',
        win: 'Ctrl + Shift + R'
    },
    alignJustify: {
        mac: '⌘ + Shift + J',
        win: 'Ctrl + Shift + J'
    },
    // 代码块
    codeBlock: {
        mac: '⌘ + Alt + C',
        win: 'Ctrl + Alt + C'
    },
    // 下标 / 上标
    sub: {
        mac: '⌘ + ,',
        win: 'Ctrl + ,'
    },
    sup: {
        mac: '⌘ + .',
        win: 'Ctrl + .'
    },
    // —— 文本选择 ——
    selectAll: {
        mac: '⌘ + A',
        win: 'Ctrl + A'
    },
    // insert暂不支持快捷键
    // insert: {
    //     mac: '⌘ + \\',
    //     win: 'Ctrl + \\'
    // }
} as const

/**
 * 检测当前操作系统
 */
export function detectPlatform(): Platform {
    if (typeof window === 'undefined') {
        return 'unknown'
    }

    const userAgent = window.navigator.userAgent.toLowerCase()

    if (userAgent.includes('mac')) {
        return 'mac'
    } else if (userAgent.includes('win')) {
        return 'windows'
    } else if (userAgent.includes('linux')) {
        return 'linux'
    }

    return 'unknown'
}

/**
 * 获取快捷键显示文本
 * @param keyMapKey 快捷键key
 */
export function getShortcutTipByKey(
    keyMapKey: string,
): string {
    const platform = detectPlatform()
    const targetKeyMap = SHORTCUTS[keyMapKey as keyof typeof SHORTCUTS];
    if (!targetKeyMap) { return '' }
    switch (platform) {
        case 'mac':
            return targetKeyMap.mac
        case 'windows':
        case 'linux':
            return targetKeyMap.win
        default:
            return targetKeyMap.win
    }
}


