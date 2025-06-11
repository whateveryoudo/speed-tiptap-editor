<!--
 * @Author: ykx
 * @Date: 2022-11-15 16:34:49
 * @LastEditTime: 2022-12-15 15:19:16
 * @LastEditors: your name
 * @Description: 颜色选择
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\textColor.vue
-->
<template>
  <a-tooltip title="字体颜色">
    <div :class="['text-color-menu-wrapper', isTitleActive && 'menu-disabled']">
      <span
        style="margin-top:-1px"
        class="shadow-bg-wrapper middle"
        @click="setColor(curColor)"
      >
        <span class="text-wrapper">A
          <span
            class="under-line"
            :style="{ backgroundColor: curColor || 'transparent' }"
          />
        </span>
      </span>
      <color-picker
        :cur-color="curColor"
        show-default
        :disabled="isTitleActive"
        @triggerColor="setColor"
      >
        <span class="shadow-bg-wrapper small dropdown-trigger">
          <caret-down-outlined />
        </span>
      </color-picker>
    </div>
  </a-tooltip>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue'
import { Editor } from '@tiptap/core'
import ColorPicker from '@/components/colorPicker/index.vue'
import { type ColorType } from '@/components/colorPicker/data'
import { CaretDownOutlined } from '@ant-design/icons-vue'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const isTitleActive = useActive(props.editor, Title.name)

const curColor = ref<ColorType>('#000000'); // 这里不使用选中回显

const setColor = (color: ColorType) => {
  if (isTitleActive.value || !color) {
    return
  }
  curColor.value = color;
  props.editor?.chain().focus().setColor(color).run()
}
</script>

<style scoped lang="less">
.text-color-menu-wrapper {
  display: flex;
  justify-items: center;
  .text-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    color: #000;
    font-size: 16px;
    .under-line {
      position: absolute;
      bottom: 3px;
      height: 2px;
      width: 130%;
      margin-left: -15%;
    }
  }
 
}
</style>
