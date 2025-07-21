import { computed } from 'vue'

export type TriggerType = 'menu' | 'bubble'

/**
 * 通用菜单按钮事件hook
 * @param handler 按钮点击处理函数
 * @param triggerType 触发类型（'menu' 工具栏，'bubble' 气泡菜单）
 * @returns 适用于v-on的事件对象
 */
export function useMenuButtonEvents(
  handler: (e?: MouseEvent) => void,
  triggerType: TriggerType = 'menu'
) {
  return computed(() => {
    if (triggerType === 'bubble') {
      return { click: handler }
    } else {
      return {
        mousedown: (e: MouseEvent) => {
          e.preventDefault()
          handler(e)
        }
      }
    }
  })
} 