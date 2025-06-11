<!--
 * @Author: ykx
 * @Date: 2022-12-07 11:40:29
 * @LastEditTime: 2023-01-05 11:53:05
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\components\basic\resizeable\index.vue
-->
<template>
  <div
    id="js-resizeable-container"
    :class="['resizable', className]"
    :style="{
      ...style,
      width: getCompatUnit(width),
      height: getCompatUnit(height),
    }"
    ref="containerRef">
    <template v-if="isEditable">
      <div class="placeholder-wrapper" ref="placeholderRef">
        <span class="resizer top-left"></span>
        <span class="resizer top-right"></span>
        <span class="resizer bottom-left"></span>
        <span class="resizer bottom-right"></span>
      </div>
      <div
        class="clone-node-wrapper"
        ref="cloneNodeRef"
        :style="{ maxWidth: maxWidth + 'px', width: getCompatUnit(width), height: getCompatUnit(height) }">
        <span class="resizer top-left"></span>
        <span class="resizer top-right"></span>
        <span class="resizer bottom-left"></span>
        <span class="resizer bottom-right"></span>
        <span ref="cloneNodeTipRef"></span>
      </div>
    </template>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, watch, onMounted } from 'vue'
import interact from 'interactjs'
import { useClickOutside } from '@/hooks/useClickOutside'
import { getCompatUnit } from '@/utils/utils'
const MIN_WIDTH = 50
const MIN_HEIGHT = 50
function clamp(val: number, min: number, max: number): string {
  if (val < min) {
    return '' + min
  }
  if (val > max) {
    return '' + max
  }
  return '' + val
}
function calcWidth(width: number, minWidth: number, maxWidth: number) {
  const val = parseInt(clamp(width, minWidth, maxWidth || Infinity))
  return val === maxWidth ? '100%' : val
}

defineOptions({
  name: 's-resizeable',
})
const props = defineProps({
  width: {
    type: [Number, String],
    default: 50,
  },
  height: {
    type: Number,
    default: 50,
  },
  maxWidth: {
    type: Number,
  },
  isEditable: {
    type: Boolean,
    default: true,
  },
  className: {
    type: String,
    default: '',
  },
  style: {
    type: Object,
    default: {},
  },
})
const emit = defineEmits(['changeEnd'])
const containerRef = ref()
const placeholderRef = ref()
const cloneNodeRef = ref()
const cloneNodeTipRef = ref()

onMounted(async () => {
  await nextTick()
  if (!props?.isEditable || !containerRef.value) {
    return
  }
  useClickOutside(containerRef.value, {
    in: () => containerRef.value && containerRef.value.classList.add('is-active'),
    out: () => {
      containerRef.value && containerRef.value.classList.remove('is-active')
    },
  })
  interact(containerRef.value).resizable({
    edges: {
      top: true,
      right: true,
      bottom: true,
      left: true,
    },
    listeners: {
      move: function (event) {
        Object.assign(placeholderRef.value?.style, {
          opacity: 0,
        })
        let { width, height } = event.rect
        const newW = calcWidth(width, MIN_WIDTH, props.maxWidth || Infinity)
        const newH = parseInt(clamp(height, MIN_HEIGHT, Infinity))
        Object.assign(cloneNodeRef.value.style, {
          width: `${newW}px`,
          height: `${newH}px`,
          zIndex: 1000,
        })
        cloneNodeTipRef.value.innerHTML = `${newW}x${newH}`
      },
      end: function (event) {
        let { width, height } = event.rect
        const newW = calcWidth(width, MIN_WIDTH, props.maxWidth || Infinity)
        const newH = parseInt(clamp(height, MIN_HEIGHT, Infinity))
        Object.assign(cloneNodeRef.value.style, {
          zIndex: -1,
        })
        cloneNodeTipRef.value.innerHTML = ''
        Object.assign(placeholderRef.value?.style, {
          opacity: 1,
        })
        emit('changeEnd', { width: newW, height: newH })
      },
    },
  })
})
// watch()
</script>

<style scoped lang="less">
.resizable {
  position: relative;
  display: inline-block;
  width: 100px;
  height: 100px;
  max-width: 100%;
  box-sizing: border-box;
  overflow: visible;
  .clone-node-wrapper {
    position: absolute;
    z-index: -1;
    display: flex;
    font-size: 14px;
    color: #333;
    background-color: rgba(179, 212, 255, 0.3);
    align-items: center;
    justify-content: center;
    user-select: none;
  }
  .resizer {
    position: absolute;
    z-index: 9999;
    width: 10px;
    height: 10px;
    background: white;
    border: 3px solid #4286f4;
    border-radius: 50%;
    opacity: 0;
    box-sizing: border-box;
  }
  .resizer.top-left {
    top: -5px;
    left: -5px;
    cursor: nwse-resize;
  }

  .resizer.top-right {
    top: -5px;
    right: -5px;
    cursor: nesw-resize;
  }

  .resizer.bottom-left {
    bottom: -5px;
    left: -5px;
    cursor: nesw-resize;
  }

  .resizer.bottom-right {
    right: -5px;
    bottom: -5px;
    cursor: nwse-resize;
  }
  &.is-active {
    .resizer {
      opacity: 1;
    }
  }
}
</style>
