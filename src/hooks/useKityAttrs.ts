/*
 * @Author: ykx
 * @Date: 2022-12-15 15:29:27
 * @LastEditTime: 2023-01-05 14:35:42
 * @LastEditors: your name
 * @Description: 获取脑图属性
 * @FilePath: \we-knowledge-base\src\tiptap\core\hooks\useKityAttrs.ts
 */

import { ref, watchEffect } from 'vue'
// getAllAttr兼容多属性获取
export function useKityAttrs(mind: any, attrbute?: string | string[], getAllAttr: boolean = false) {
  if (!mind) return
  const node = ref()
  const attr = ref()
  const attrs = ref<any>([])
  watchEffect(() => {
    // 获取单个属性(区分获取类型？？)
    const getAttr = (key: string) => {
      let tempAttr
      switch (key) {
        case 'undo':
          tempAttr = mind.editor.history.hasUndo()
          break
        case 'redo':
          tempAttr = mind.editor.history.hasRedo()
          break
        case 'isBold':
          tempAttr = mind.queryCommandState('Bold') === 1
          break
        case 'textColor':
          tempAttr = mind.queryCommandState('ForeColor')
          break
        case 'bgColor':
          tempAttr = node.value ? mind.queryCommandValue('Background') : ''
          break
        case 'link':
          tempAttr = node.value ? mind.queryCommandValue('hyperlink')?.url : ''
          break
        case 'priority':
          tempAttr = node.value ? mind.queryCommandValue('priority') : ''
          break
        case 'progress':
          tempAttr = node.value ? mind.queryCommandValue('progress') : ''
          break
        case 'template':
          tempAttr = node.value ? mind.queryCommandValue('template') : ''
          break
        case 'theme':
          tempAttr = node.value ? mind.queryCommandValue('theme') : ''
          break
        case 'AppendChildNode':
          tempAttr = mind.queryCommandState('AppendChildNode')
          break
        case 'AppendParentNode':
          tempAttr = mind.queryCommandState('AppendParentNode')
          break
        case 'AppendSiblingNode':
          tempAttr = mind.queryCommandState('AppendSiblingNode')
          break
        case 'ArrangeUp':
          tempAttr = mind.queryCommandState('ArrangeUp')
          break
        case 'ArrangeDown':
          tempAttr = mind.queryCommandState('ArrangeDown')
          break
        case 'text':
          tempAttr = mind.queryCommandState('text')
          break
        case 'RemoveNode':
          tempAttr = mind.queryCommandState('RemoveNode')
          break
        case 'image':
          tempAttr = getAllAttr
            ? {
                val: node.value ? mind.queryCommandValue('image')?.url : '', // 防止与ref.value冲突
                state: mind.queryCommandState('image'),
              }
            : mind.queryCommandState('image')
          break
      }
      return tempAttr
    }
    const listener = () => {
      node.value = mind.getSelectedNode()
      if (Array.isArray(attrbute) && attrbute.length > 0) {
        attrs.value = attrbute.map((key: string) => {
          return getAttr(key)
        })
      } else {
        attr.value = getAttr(attrbute as string)
      }
    }

    mind.on('interactchange', listener)

    return () => {
      mind.off('interactchange', listener)
    }
  })

  return {
    node,
    attr,
    attrs,
  }
}
