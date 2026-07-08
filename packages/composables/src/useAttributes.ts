import type { Editor } from '@tiptap/core'
import { cloneDeep, isEqual } from 'lodash-es'
import { ref, watchEffect, type Ref } from 'vue'

type MapFn<T, R> = (arg: T) => R

function mapSelf<T>(d: T): T {
  return d
}

export function useAttributes<T, R = T>(
  editor: Editor,
  attrbute: string,
  defaultValue?: T,
  map?: (arg: T) => R,
): Ref<R | undefined> {
  const mapFn = (map || mapSelf) as MapFn<T, R>
  const valueRef = ref<R | undefined>(mapFn(defaultValue!))
  let prevValueCache = cloneDeep(valueRef.value)

  watchEffect((onCleanup) => {
    const listener = () => {
      const attrs = { ...defaultValue, ...editor.getAttributes(attrbute) }
      for (const key of Object.keys(attrs)) {
        if (attrs[key as keyof typeof attrs] === null || attrs[key as keyof typeof attrs] === undefined) {
          ;(attrs as Record<string, unknown>)[key] = (defaultValue as Record<string, unknown>)?.[key]
        }
      }
      const nextAttrs = mapFn(attrs as T)
      if (isEqual(prevValueCache, nextAttrs)) {
        return
      }
      valueRef.value = nextAttrs
      prevValueCache = nextAttrs
    }

    editor.on('selectionUpdate', listener)
    editor.on('transaction', listener)
    onCleanup(() => {
      editor.off('selectionUpdate', listener)
      editor.off('transaction', listener)
    })
  })

  return valueRef as Ref<R>
}
