/*
 * @Author: ykx
 * @Date: 2024-01-09
 * @LastEditTime: 2024-01-09
 * @LastEditors: your name
 * @Description: Floating UI 弹出层管理 Hook
 * @FilePath: src/hooks/useFloatingPopup.ts
 */
import { ref, onUnmounted } from 'vue'
import { computePosition, offset, flip, shift } from '@floating-ui/dom'
import type { VueRenderer } from '@tiptap/vue-3'

interface FloatingPopupOptions {
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end'
  offset?: number
  padding?: number
  zIndex?: number
}

interface PopupInstance {
  popup: HTMLElement
  component: VueRenderer
  updatePosition: (clientRect: () => DOMRect) => Promise<void>
  destroy: () => void
}

export function useFloatingPopup(options: FloatingPopupOptions = {}) {
  const {
    placement = 'bottom-start',
    offset: offsetValue = 4,
    padding = 8,
    zIndex = 9999
  } = options

  const popupInstance = ref<PopupInstance | null>(null)

  const createPopup = (component: VueRenderer): PopupInstance => {
    // 创建弹出层容器
    const popup = document.createElement('div')
    popup.style.position = 'fixed'
    popup.style.zIndex = zIndex.toString()
    popup.style.pointerEvents = 'auto'
    
    // 确保 component.element 存在
    if (component.element) {
      popup.appendChild(component.element)
    }
    
    document.body.appendChild(popup)

    // 更新位置的函数
    const updatePosition = async (clientRect: () => DOMRect) => {
      const rect = clientRect()
      const virtualElement = {
        getBoundingClientRect: () => rect,
      }

      const { x, y } = await computePosition(virtualElement, popup, {
        placement,
        middleware: [
          offset(offsetValue),
          flip(),
          shift({ padding })
        ],
      })

      popup.style.left = `${x}px`
      popup.style.top = `${y}px`
    }

    // 销毁函数
    const destroy = () => {
      if (popup && popup.parentNode) {
        popup.parentNode.removeChild(popup)
      }
      component.destroy()
    }

    return {
      popup,
      component,
      updatePosition,
      destroy
    }
  }

  const showPopup = (component: VueRenderer, clientRect: () => DOMRect) => {
    // 如果已有弹出层，先销毁
    if (popupInstance.value) {
      popupInstance.value.destroy()
    }

    // 创建新的弹出层
    const instance = createPopup(component)
    popupInstance.value = instance

    // 计算初始位置
    instance.updatePosition(clientRect)
  }

  const updatePopupPosition = async (clientRect: () => DOMRect) => {
    if (popupInstance.value) {
      await popupInstance.value.updatePosition(clientRect)
    }
  }

  const hidePopup = () => {
    if (popupInstance.value) {
      popupInstance.value.destroy()
      popupInstance.value = null
    }
  }

  // 组件卸载时清理
  onUnmounted(() => {
    hidePopup()
  })

  return {
    showPopup,
    updatePopupPosition,
    hidePopup,
    popupInstance
  }
} 