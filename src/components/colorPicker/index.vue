<!--
 * @Author: ykx
 * @Date: 2022-11-18 17:07:13
 * @LastEditTime: 2022-11-18 20:14:54
 * @LastEditors: your name
 * @Description: 自定义部分颜色选择(pop的内部动态控制无效，disabled无效，一直会触发)
 * @FilePath: \we-knowledge-base\src\components\colorPicker\index.vue
-->

<template>
  <a-popover
    v-if="!disabled"
    overlay-class-name="color-board-popover-wrapper"
    trigger="click"
    placement="bottomLeft"
  >
    <template #content>
      <div class="color-board-wrapper">
        <div
          class="top-choosed-wrapper transition-bg"
          @click="chooseColor(showDefault ? defaultColor : null)"
        >
          <div
            v-if="showDefault"
            class="top-choosed-item"
          >
            <span class="color-board-item"><span
              class="color-inner"
              :style="{ backgroundColor: defaultColor }"
            /></span>
            默认
          </div>
          <div
            v-else
            class="top-choosed-item"
          >
            <span class="color-board-item no-color"><span class="color-inner" /></span>
            无填充色
          </div>
        </div>
        <ul class="color-board-list-wrapper">
          <li
            v-for="(color, index) in colors"
            :key="index"
            class="color-board-item"
            @click="chooseColor(color)"
          >
            <span
              class="color-inner"
              :style="{ backgroundColor: color }"
            />
            <check-outlined
              v-if="color === curColor"
              class="checked-icon"
            />
          </li>
        </ul>
      </div>
    </template>
    <slot />
  </a-popover>
  <slot v-else />
</template>

<script setup lang="tsx">
import { ref, PropType } from 'vue'
import { colors, type ColorType } from './data'
const defaultColor: ColorType = '#000000'
const props = defineProps({
  curColor: {
    type: String as PropType<ColorType>,
    default: '',
  },
  showDefault: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['triggerColor'])
const visible = ref(false)
const chooseColor = (color: ColorType) => {
  emit('triggerColor', color)
  visible.value = false
}
const handleOpen = () => {
  visible.value = !props.disabled
}
</script>
<style lang="less">
.color-board-popover-wrapper {
  width: 240px;
  .ant-popover-inner-content {
    padding: 0;
  }
  .color-board-wrapper {
    padding-top: 5px;
    .top-choosed-item {
      display: flex;
      padding: 8px;
      cursor: pointer;
      align-items: center;
      .color-board-item {
        margin-right: 5px;
      }
      .no-color {
        background-color: transparent;
        & > span {
          border: 1px solid #f4f5f5;
          &::after {
            position: absolute;
            top: 8px;
            left: 0;
            display: block;
            width: 17px;
            height: 0;
            content: '';
            transform: rotate(45deg);
            border-bottom: 2px solid #ff5151;
          }
        }
      }
    }
    .color-board-list-wrapper {
      margin: 0;
      padding: 8px;
      font-size: 0;
    }
  }
  .color-board-item {
    width: 24px;
    height: 24px;
    padding: 2px 2px;
    display: inline-block;
    border-radius: 3px 3px;
    border: 1px solid transparent;
    flex: 0 0 auto;
    cursor: pointer;
    position: relative;
    &:hover {
      border: 1px solid #d8dad9;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
    }
    & > span.color-inner {
      position: relative;
      width: 18px;
      height: 18px;
      display: block;
      border-radius: 2px 2px;
    }
    .checked-icon {
      font-size: 12px;
      color: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
