<!--
  文档流内图片缩放：四角手柄、强制等比，拖动中只显示占位框（语雀风格）
-->
<template>
  <div
    id="js-resizeable-container"
    ref="rootRef"
    class="image-resize-frame"
    :class="{
      'is-selected': selected,
      'is-resizing': resizing,
      'has-size': !!displayWidth && !!displayHeight,
    }"
    :style="frameStyle"
    @mousedown="onSelect"
  >
    <div class="image-resize-content">
      <slot />
    </div>

    <template v-if="selected && editable">
      <div class="image-resize-mask" aria-hidden="true" />
      <span
        v-for="handle in handles"
        :key="handle"
        class="image-resize-handle"
        :class="handle"
        @mousedown.stop.prevent="onResizeStart($event, handle)"
      />
    </template>

    <div
      v-show="resizing"
      class="image-resize-ghost"
      :style="ghostStyle"
    >
      <span class="image-resize-tip">{{ tipText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

type Handle = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

const props = withDefaults(
  defineProps<{
    width: number | string
    height: number | string
    maxWidth?: number
    minSize?: number
    editable?: boolean
    selected?: boolean
  }>(),
  {
    maxWidth: Infinity,
    minSize: 48,
    editable: true,
    selected: false,
  },
)

const emit = defineEmits<{
  select: []
  changeEnd: [{ width: number; height: number }]
}>()

const handles: Handle[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
const rootRef = ref<HTMLElement | null>(null)
const resizing = ref(false)
const ghostW = ref(0)
const ghostH = ref(0)

const toNumber = (v: number | string) => {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  const n = parseFloat(String(v))
  return Number.isFinite(n) ? n : NaN
}

const displayWidth = computed(() => {
  const w = toNumber(props.width)
  return Number.isFinite(w) && w > 0 ? w : undefined
})

const displayHeight = computed(() => {
  const h = toNumber(props.height)
  return Number.isFinite(h) && h > 0 ? h : undefined
})

const frameStyle = computed(() => {
  const style: Record<string, string> = { maxWidth: '100%' }
  if (displayWidth.value) style.width = `${displayWidth.value}px`
  if (displayHeight.value) style.height = `${displayHeight.value}px`
  return style
})

const ghostStyle = computed(() => ({
  width: `${ghostW.value}px`,
  height: `${ghostH.value}px`,
}))

const tipText = computed(
  () => `${Math.round(ghostW.value)} × ${Math.round(ghostH.value)}`,
)

const onSelect = () => {
  if (!props.editable) return
  emit('select')
}

const clampSize = (width: number, height: number, ratio: number) => {
  const maxW = props.maxWidth && Number.isFinite(props.maxWidth) ? props.maxWidth : Infinity
  let w = Math.min(Math.max(width, props.minSize), maxW)
  let h = w / ratio
  if (h < props.minSize) {
    h = props.minSize
    w = h * ratio
    if (w > maxW) {
      w = maxW
      h = w / ratio
    }
  }
  return { width: w, height: h }
}

let startX = 0
let startW = 0
let startH = 0
let aspect = 1
let activeHandle: Handle = 'bottom-right'

const onPointerMove = (e: MouseEvent) => {
  if (!resizing.value) return
  const dx = e.clientX - startX
  // 右侧手柄跟拖同向增大；左侧反向
  const growRight = activeHandle.includes('right')
  const rawW = growRight ? startW + dx : startW - dx
  const next = clampSize(rawW, rawW / aspect, aspect)
  ghostW.value = next.width
  ghostH.value = next.height
}

const onPointerUp = () => {
  if (!resizing.value) return
  resizing.value = false
  window.removeEventListener('mousemove', onPointerMove)
  window.removeEventListener('mouseup', onPointerUp)
  emit('changeEnd', {
    width: Number(ghostW.value.toFixed(2)),
    height: Number(ghostH.value.toFixed(2)),
  })
  // 松手后再请求选中，避免 mouseup 抢焦点导致手柄立刻消失
  emit('select')
}

const onResizeStart = (e: MouseEvent, handle: Handle) => {
  if (!props.editable) return
  emit('select')
  const rect = rootRef.value?.getBoundingClientRect()
  const w = displayWidth.value || rect?.width || props.minSize
  const h = displayHeight.value || rect?.height || props.minSize
  if (!w || !h) return

  activeHandle = handle
  startX = e.clientX
  startW = w
  startH = h
  aspect = w / h
  ghostW.value = w
  ghostH.value = h
  resizing.value = true
  window.addEventListener('mousemove', onPointerMove)
  window.addEventListener('mouseup', onPointerUp)
}

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onPointerMove)
  window.removeEventListener('mouseup', onPointerUp)
})
</script>

<style scoped lang="less">
.image-resize-frame {
  position: relative;
  display: inline-block;
  max-width: 100%;
  line-height: 0;
  box-sizing: border-box;
  vertical-align: bottom;

  .image-resize-content {
    width: 100%;
    height: 100%;

    :deep(img) {
      display: block;
      max-width: 100%;
      user-select: none;
      -webkit-user-drag: none;
    }
  }

  /* 已有数值尺寸：撑满框；未测出尺寸前跟自然宽高 */
  &.has-size .image-resize-content :deep(img) {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .image-resize-mask {
    pointer-events: none;
    position: absolute;
    inset: 0;
    border: 1px solid var(--ant-color-primary, #1677ff);
    box-sizing: border-box;
    z-index: 1;
  }

  .image-resize-handle {
    position: absolute;
    z-index: 2;
    width: 10px;
    height: 10px;
    box-sizing: border-box;
    background: #fff;
    border: 2px solid var(--ant-color-primary, #1677ff);
    border-radius: 50%;

    &.top-left {
      top: -5px;
      left: -5px;
      cursor: nwse-resize;
    }
    &.top-right {
      top: -5px;
      right: -5px;
      cursor: nesw-resize;
    }
    &.bottom-left {
      bottom: -5px;
      left: -5px;
      cursor: nesw-resize;
    }
    &.bottom-right {
      bottom: -5px;
      right: -5px;
      cursor: nwse-resize;
    }
  }

  .image-resize-ghost {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
    pointer-events: none;
    box-sizing: border-box;
    border: 1px solid var(--ant-color-primary, #1677ff);
    background: rgba(22, 119, 255, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .image-resize-tip {
    pointer-events: none;
    font-size: 12px;
    line-height: 1;
    color: #fff;
    background: rgba(0, 0, 0, 0.55);
    padding: 4px 8px;
    border-radius: 4px;
  }

  &.is-resizing {
    .image-resize-content {
      opacity: 0.35;
    }
  }
}
</style>
