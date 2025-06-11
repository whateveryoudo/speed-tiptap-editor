/*
 * @Author: ykx
 * @Date: 2022-11-17 17:19:25
 * @LastEditTime: 2022-11-18 15:19:53
 * @LastEditors: your name
 * @Description: 获取editor属性
 * @FilePath: \we-knowledge-base\src\tiptap\core\hooks\useAttributes.ts
 */
import { Editor } from '@tiptap/core'
import { ref, watchEffect } from 'vue'
import { isEqual, cloneDeep } from 'lodash-es'
type MapFn<T, R> = (arg: T) => R
function mapSelf<T>(d: T): T {
  return d
}
export function useAttributes<T, R = T>(
  editor: Editor,
  attrbute: string,
  defaultValue?: T,
  map?: (arg: T) => R,
) {
  const mapFn = (map || mapSelf) as MapFn<T, R>
  const valueRef = ref<R>(mapFn(defaultValue!))
  let prevValueCache = cloneDeep(valueRef.value as any)
  watchEffect(() => {
    const listener = () => {
      const attrs = { ...defaultValue, ...editor.getAttributes(attrbute) }
      Object.keys(attrs).forEach(key => {
        if (attrs[key] === null || attrs[key] === undefined) {
          attrs[key] = (defaultValue as any)[key]
        }
      })
      const nextAttrs = mapFn(attrs as T);
      if (isEqual(prevValueCache, nextAttrs)) {
        return
      }
      (valueRef.value as any) = nextAttrs
      prevValueCache = nextAttrs
    }

    editor.on('selectionUpdate', listener)
    editor.on('transaction', listener)

    return () => {
      editor.off('selectionUpdate', listener)
      editor.off('transaction', listener)
    }
  })
  return valueRef
}
