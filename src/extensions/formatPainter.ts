import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

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
      isFormatPainterActive: false
    }
  },

  addCommands() {
    return {
      copyFormat: () => ({ state }) => {
        const { selection } = state
        const { $from } = selection
        
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
        const marks = $from.marks()
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
        
        // 恢复默认光标
        this.editor.view.dom.style.cursor = 'text'
        
        return commands.unsetAllMarks()
      }
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-s': () => this.editor.commands.copyFormat(),
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
                // 自动应用格式
                this.editor.commands.applyFormat()
                // 应用后清除格式刷状态
                this.storage.isFormatPainterActive = false
                // 恢复默认光标
                view.dom.style.cursor = 'text'
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
                      this.storage.isFormatPainterActive = false
                      view.dom.style.cursor = 'text'
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