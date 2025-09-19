/**
 * 功能: 通用四边缩放 Hook（支持 left/right/top/bottom 任意边）
 * - 仅管理宽高数值与事件绑定，不处理定位与布局
 * - 可按需只暴露某一边的拖拽句柄
 */
import { ref, onBeforeUnmount, type Ref } from 'vue'

export type Edge = 'left' | 'right' | 'top' | 'bottom'

export interface UseEdgeResizeOptions {
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  keepAspectRatio?: boolean
  onResize?: (rect: { width: number; height: number }) => void
}

export function useEdgeResize(
  targetEl: Ref<HTMLElement | null>,
  initial: { width?: number; height?: number },
  options: UseEdgeResizeOptions = {}
) {
  const width = ref<number>(initial.width ?? 0)
  const height = ref<number>(initial.height ?? 0)

  let startX = 0
  let startY = 0
  let startW = 0
  let startH = 0
  let activeEdge: Edge | null = null

  const applyBounds = (w: number, h: number) => {
    const {
      minWidth = 0,
      minHeight = 0,
      maxWidth = Infinity,
      maxHeight = Infinity,
      keepAspectRatio,
    } = options

    if (keepAspectRatio && startW > 0 && startH > 0) {
      const ratio = startW / startH
      // 以变化更大的一侧为基准
      if (Math.abs(w - startW) > Math.abs(h - startH)) {
        h = w / ratio
      } else {
        w = h * ratio
      }
    }

    w = Math.max(minWidth, Math.min(maxWidth, w))
    h = Math.max(minHeight, Math.min(maxHeight, h))
    return { w, h }
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!activeEdge) return
    const clientX = e.clientX
    const clientY = e.clientY
    const dx = clientX - startX
    const dy = clientY - startY

    let nextW = Number(startW)
    let nextH = Number(startH)
    if (activeEdge === 'right') nextW = Number(startW) + dx
    if (activeEdge === 'left')  nextW = Number(startW) - dx
    if (activeEdge === 'bottom') nextH = Number(startH) + dy
    if (activeEdge === 'top')   nextH = Number(startH) - dy
    const { w, h } = applyBounds(nextW, nextH)
    width.value = Math.round(w)
    height.value = Math.round(h)
    options.onResize?.({ width: width.value, height: height.value })
  }

  const endResize = () => {
    activeEdge = null
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', endResize)
  }

  const startResize = (edge: Edge, e: PointerEvent) => {
    if (!targetEl.value) return
    activeEdge = edge
    
    const clientX = e.clientX
    const clientY = e.clientY
    startX = clientX
    startY = clientY
    startW = Number(width.value) || 0
    startH = Number(height.value) || 0
    e.preventDefault()
    
    if ('pointerId' in e) {
      targetEl.value.setPointerCapture?.(e.pointerId)
    }
    
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerup', endResize, { once: true })
  }

  onBeforeUnmount(endResize)

  return {
    width,
    height,
    startResize,
  }
}


