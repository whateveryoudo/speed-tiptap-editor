import { onMounted, onUnmounted, type Ref } from 'vue'

export function useClickOutside(target: Ref<HTMLElement | null>, handler: () => void) {
  const listener = (event: MouseEvent) => {
    const el = target.value
    if (!el || el.contains(event.target as Node)) return
    handler()
  }
  onMounted(() => document.addEventListener('click', listener))
  onUnmounted(() => document.removeEventListener('click', listener))
}
