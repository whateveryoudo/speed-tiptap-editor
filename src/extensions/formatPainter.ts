import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { message } from 'ant-design-vue'
// 存储格式信息
interface FormatInfo {
  marks: Record<string, any>
  nodeAttrs: Record<string, any>
  textAlign?: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    formatPainter: {
      copyFormat: () => ReturnType
      applyFormat: () => ReturnType
      clearFormat: () => ReturnType
    }
  }
}

export const FormatPainter = Extension.create({
  name: 'formatPainter',

  addStorage() {
    return {
      copiedFormat: null as FormatInfo | null,
      isFormatPainterActive: false,
      // 激活模式：single(一次性，点击菜单触发) | sticky(连续，快捷键触发)
      activationMode: 'single' as 'single' | 'sticky',
    }
  },

  addCommands() {
    return {
      copyFormat: () => ({ state }) => {
        const { selection } = state
        const { $head, $from } = selection

        if (selection.empty) {
          return false
        }

        // 获取选中文本的格式信息
        const formatInfo: FormatInfo = {
          marks: {},
          nodeAttrs: {},
          textAlign: undefined
        }

        // 收集所有 marks
        const marks = $head.marks()
        marks.forEach(mark => {
          formatInfo.marks[mark.type.name] = mark.attrs
        })

        // 收集节点属性
        const node = $from.parent
        if (node.attrs) {
          formatInfo.nodeAttrs = { ...node.attrs }
        }

        // 获取文本对齐方式
        const textAlign = node.attrs?.textAlign || node.attrs?.align
        if (textAlign) {
          formatInfo.textAlign = textAlign
        }

        // 存储格式信息
        this.storage.copiedFormat = formatInfo
        // 如果未显式设置模式，则默认走一次性(single)
        if (!this.storage.activationMode) {
          this.storage.activationMode = 'single'
        }
        this.storage.isFormatPainterActive = true

        // 显示提示信息
        this.editor.view.dom.style.cursor = 'copy'

        return true
      },

      applyFormat: () => ({ state, tr, dispatch }) => {
        if (!this.storage.copiedFormat) {
          return false
        }

        const { selection } = state
        const { $from, $to } = selection

        if (selection.empty) {
          return false
        }

        const formatInfo = this.storage.copiedFormat

        // 应用 marks
        Object.entries(formatInfo.marks).forEach(([markName, attrs]) => {
          const markType = state.schema.marks[markName]
          if (markType) {
            tr.addMark($from.pos, $to.pos, markType.create(attrs as any))
          }
        })

        // 应用节点属性
        if (formatInfo.textAlign) {
          tr.setNodeMarkup($from.before($from.depth), undefined, {
            ...$from.parent.attrs,
            textAlign: formatInfo.textAlign
          })
        }

        if (dispatch) {
          dispatch(tr)
        }

        return true
      },

      clearFormat: () => ({ commands }) => {
        this.storage.copiedFormat = null
        this.storage.isFormatPainterActive = false
        this.storage.activationMode = 'single'

        // 恢复默认光标
        this.editor.view.dom.style.cursor = 'text'

        return commands.unsetAllMarks()
      }
    }
  },

  addKeyboardShortcuts() {
    return {
      // 这里定义为 Mod-Shift-X 是为了避免与 Mod-Shift-S 冲突，因为 Mod-Shift-S 是删除线
      'Mod-Shift-X': () => {
        message.info('已经开启格式刷，按Esc退出')
        // 快捷键进入连续模式(sticky)
        this.storage.activationMode = 'sticky'
        return this.editor.commands.copyFormat();
      },
      'Escape': () => this.editor.commands.clearFormat(),
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('formatPainter'),
        props: {
          handleDOMEvents: {
            mouseup: (view) => {
              if (this.storage.isFormatPainterActive && !view.state.selection.empty) {
                // 自动应用格式（保持启用，不自动退出，直到按 Esc）
                this.editor.commands.applyFormat()
                // 根据模式决定是否退出
                if (this.storage.activationMode === 'single') {
                  this.storage.isFormatPainterActive = false
                  view.dom.style.cursor = 'text'
                } else {
                  view.dom.style.cursor = 'copy'
                }
                // 触发编辑器更新事件，确保组件状态同步
                this.editor.view.dispatch(this.editor.view.state.tr)
                return true
              }
              return false
            },
            keyup: (view, event) => {
              if (this.storage.isFormatPainterActive && !view.state.selection.empty) {
                // 检查是否是选择相关的按键
                if (event.shiftKey || ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
                  // 延迟一点时间让选择完成
                  setTimeout(() => {
                    if (this.storage.isFormatPainterActive && !view.state.selection.empty) {
                      this.editor.commands.applyFormat()
                      if (this.storage.activationMode === 'single') {
                        this.storage.isFormatPainterActive = false
                        view.dom.style.cursor = 'text'
                      } else {
                        view.dom.style.cursor = 'copy'
                      }
                      // 触发编辑器更新事件，确保组件状态同步
                      this.editor.view.dispatch(this.editor.view.state.tr)
                    }
                  }, 10)
                  return true
                }
              }
              return false
            }
          }
        }
      })
    ]
  }
})