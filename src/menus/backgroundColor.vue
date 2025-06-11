<!--
 * @Author: ykx
 * @Date: 2022-11-18 19:02:23
 * @LastEditTime: 2022-12-07 11:03:58
 * @LastEditors: your name
 * @Description: 背景色选择
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\backgroundColor.vue
-->

<template>
  <a-tooltip title="背景颜色">
    <div :class="['bg-color-menu-wrapper', isTitleActive && 'menu-disabled']">
      <span class="shadow-bg-wrapper middle" @click="setBackgroundColor(curColor)">
        <span class="text-wrapper">
          <s-icon-font
            :size="17"
            type="icon-kl-fill-color"
          />
          <span
            class="under-line"
            :style="{ backgroundColor: curColor || '#fff' }"
          />
        </span>
      </span>
      <color-picker
        :cur-color="curColor"
        :disabled="isTitleActive"
        @triggerColor="setBackgroundColor"
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
import { useAttributes } from '@/hooks/useAttributes'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const curColor = ref<ColorType | null>();
const isTitleActive = useActive(props.editor, Title.name)

const setBackgroundColor = (color: ColorType) => {
  if (isTitleActive.value || !color) {
    props.editor?.chain().focus().unsetBackgroundColor().run();
  } else {
    props.editor?.chain().focus().setBackgroundColor(color).run()
  }
  curColor.value = color;
}
</script>

<style scoped lang="less">
.bg-color-menu-wrapper {
  display: flex;
  justify-items: center;
  .text-wrapper {
    display: flex;
    position: relative;
    .under-line {
      position: absolute;
      bottom: 0px;
      height: 2px;
      width: 80%;
      left: 10%;
    }
  }
  .dropdown-trigger {
    :deep(.anticon) {
      font-size: 10px;
      color: #666;
    }
  }
}
</style>
