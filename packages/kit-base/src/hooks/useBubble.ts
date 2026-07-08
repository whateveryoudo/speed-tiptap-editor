/*
 * @Author: ykx
 * @Date: 2022-12-08 19:28:16
 * @LastEditTime: 2023-01-10 14:48:57
 * @LastEditors: your name
 * @Description: 部分气泡公共方法
 * @FilePath: \we-knowledge-base\src\tiptap\editor\collaboration\bubbleMenus\hooks\useBubble.ts
 */
import { Editor } from '@tiptap/core'
import { posToDOMRect } from '@tiptap/core'
import { deleteNode, copyNode } from '../prose-utils'

interface HandleBubbleOptions {
  tippyRectSelector?: string
  nodeName?: string
}
export const useBubble = (editor: Editor, handleBubbleOptions: HandleBubbleOptions) => {
  //获取指定容器气泡渲染
  const { tippyRectSelector = '#js-resizeable-container', nodeName = '' } = handleBubbleOptions
  const getRenderRect = () => {
    const view = editor.view
    const selection = view?.state?.selection
    const { ranges } = selection
    const from = Math.min(...ranges.map(range => range.$from.pos))
    const to = Math.max(...ranges.map(range => range.$to.pos))
    const domAtPos = view.domAtPos(from).node as HTMLElement
    const nodeDOM = view.nodeDOM(from) as HTMLElement
    const node = nodeDOM || domAtPos
    try {
      if (!tippyRectSelector) {
        return posToDOMRect(view, from, to)
      }
      const inner = node.querySelector(tippyRectSelector)
      return inner ? inner.getBoundingClientRect() : posToDOMRect(view, from, to)
    } catch (e) {
      return posToDOMRect(view, from, to)
    }
  }
  // 兼容多种调用
  const handleDelNode = (name?: string | MouseEvent) => {
    if (name && typeof name !== 'string' && name.target) {
      deleteNode(nodeName, editor)
    } else if (typeof name === 'string') {
      deleteNode(name, editor)
    }
  }
  const handleCopyNode = (name?: string | MouseEvent) => {
    if (name && typeof name !== 'string' && name.target) {
      copyNode(nodeName, editor)
    } else if (typeof name === 'string') {
      copyNode(name, editor)
    }
  }
  const handleCutNode = (name?: string | MouseEvent) => {
    // 剪切 = 复制 + 删除
    if (name && typeof name !== 'string' && name.target) {
      copyNode(nodeName, editor)
      deleteNode(nodeName, editor)
    } else if (typeof name === 'string') {
      copyNode(name, editor)
      deleteNode(name, editor)
    }
  }
  return {
    getRenderRect,
    handleDelNode,
    handleCopyNode,
    handleCutNode,
  }
}
