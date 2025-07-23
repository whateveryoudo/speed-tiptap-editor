/*
 * @Author: ykx
 * @Date: 2022-12-07 15:08:45
 * @LastEditTime: 2022-12-07 17:26:02
 * @LastEditors: your name
 * @Description:
 * @FilePath: \we-knowledge-base\src\hooks\useClickOutside.tsx
 */
import { watchEffect } from 'vue'

export function useClickOutside(
  ref: any,
  handler: { in?: (evt: MouseEvent) => void; out?: (evt: MouseEvent) => void },
) {
  watchEffect(() => {
    const listener = (event: any) => {
      if (!ref || ref.contains(event.target)) {
        handler.in && handler.in(event)
      } else {
        handler.out && handler.out(event)
      }
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  })
}
