<!--
  功能说明：自动扩展表格选择器菜单组件
  该组件用于在插入菜单中选择自动扩展表格的行列数，支持动态扩展
-->

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const MAX_ROWS = 10
const MAX_COLS = 10

/**
 * 选中的行数和列数
 */
const rows = ref(0)
const cols = ref(0)
// 网格的行数和列数
const boxRows = ref(4)
const boxCols = ref(4)
// 最小行数和列数
const minRows = 4
const minCols = 4

const emit = defineEmits<{
  (e: 'select', payload: { rows: number, cols: number }): void
}>()

/**
 * 鼠标悬浮时高亮对应的单元格，并在边界处自动扩展
 */
function handleHover(r: number, c: number) {
  rows.value = r
  cols.value = c

  // 在边界处自动扩展
  if (r === boxRows.value && boxRows.value < MAX_ROWS) {
    boxRows.value++
  } else {
    if (r + 1 > MAX_ROWS) {
      boxRows.value = MAX_ROWS
    } else {
      boxRows.value = Math.max(r + 1, minRows)
    }
  }
  if (c === boxCols.value && boxCols.value < MAX_COLS) {
    boxCols.value++
  } else {
    if (c + 1 > MAX_COLS) {
      boxCols.value = MAX_COLS
    } else {
      boxCols.value = Math.max(c + 1, minCols)
    }
  }
}




/**
 * 重置表格大小
 */
function resetSize() {
  boxRows.value = minRows
  boxCols.value = minCols
  rows.value = 0
  cols.value = 0
}

/**
 * 点击选择表格尺寸
 */
function handleSelect() {
  emit('select', { rows: rows.value, cols: cols.value })
  // 选择完成后重置大小
  resetSize()
}

// 组件卸载时重置大小
onUnmounted(() => {
  resetSize()
})
</script>

<template>
  <div 
    class="select-none"
  >
    <div class="flex flex-col gap-[2px] mb-2">
      <div
        v-for="r in boxRows"
        :key="r"
        class="flex gap-[2px]"
      >
        <div
          v-for="c in boxCols"
          :key="c"
          class="w-20px h-20px cursor-pointer transition-all"
          :style="{
            borderRadius: 'var(--ant-border-radius-sm)',
            transitionDuration: 'var(--ant-motion-duration-mid)',
            backgroundColor: r <= rows && c <= cols ? 'var(--ant-color-primary-bg)' : 'var(--ant-color-bg-container)',
            borderColor: 'var(--ant-color-border)',
            borderWidth: '1px',
            borderStyle: 'solid'
          }"
          @mouseenter="handleHover(r, c)"
          @click="handleSelect"
        ></div>
      </div>
    </div>
    <div class="mt-1" :style="{ 
      color: 'var(--ant-color-text-secondary)',
      fontSize: 'var(--ant-font-size-sm)'
    }">
      {{ rows }} 行 × {{ cols }} 列
    </div>
  </div>
</template>
