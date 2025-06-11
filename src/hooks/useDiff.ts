/*
 * @Author: ykx
 * @Date: 2022-11-23 17:49:44
 * @LastEditTime: 2022-11-25 16:17:08
 * @LastEditors: your name
 * @Description: 字符串对比操作(新增&删除&替换)
 * @FilePath: \we-knowledge-base\src\tiptap\core\hooks\useDiff.ts
 */
import { ref } from 'vue'
export const useDiff = (oldStr: string, newStr: string) => {
  let longerStr = oldStr,
    shorterStr = newStr
  console.log(oldStr, newStr)
  if (oldStr.length < newStr.length) {
    longerStr = newStr
    shorterStr = oldStr
  }
  const startIndex = ref(0)
  const endIndex = ref(0)
  for (let i = 0; i < longerStr.length; i++) {
    if (longerStr[i] !== shorterStr[i]) {
      startIndex.value = i
      break
    }
  }
  if (!oldStr) {
    endIndex.value = newStr.length - 1
  } else {
    const reduceNum = longerStr.length - shorterStr.length
    for (let j = shorterStr.length - 1; j > 0; j--) {
      if (shorterStr[j] !== longerStr[j + reduceNum]) {
        endIndex.value = j + reduceNum
        break
      }
    }
  }

  return {
    startIndex,
    endIndex,
    changeStr: longerStr.substring(startIndex.value, endIndex.value + 1),
  }
}
