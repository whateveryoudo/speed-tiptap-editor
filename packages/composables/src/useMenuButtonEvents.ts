import { computed } from 'vue'

export type TriggerType = 'menu' | 'bubble'

export function useMenuButtonEvents(
  handler: (e?: MouseEvent) => void,
  triggerType: TriggerType = 'menu',
) {
  return computed(() => {
    if (triggerType === 'bubble') {
      return { click: handler }
    }
    return {
      mousedown: (e: MouseEvent) => {
        e.preventDefault()
        handler(e)
      },
    }
  })
}
