<!--
 * @Author: ykx
 * @Date: 2022-11-15 16:34:49
 * @LastEditTime: 2022-12-15 15:19:16
 * @LastEditors: your name
 * @Description: 颜色选择（TODO:渐变支持）
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\textColor.vue
-->
<template>
  <s-keymap-tip :keyMap="keyMap" :title="disableMenu ? null : '字体颜色'">
    <div :class="['text-color-menu-wrapper']">
      <a-button type="text" class="shadow-btn-wrapper middle" style="margin-top:-1px" :disabled="disableMenu"
        v-on="buttonEvents">
        <span class="text-wrapper" :style="{ color: disableMenu ? 'rgba(0, 0, 0, 0.25)' : '#000' }">A
          <span class="under-line"
            :style="{ backgroundColor: disableMenu ? 'rgba(0, 0, 0, 0.25)' : curColor || 'transparent' }" />
        </span>
      </a-button>
      <color-picker :cur-color="curColor" show-default :disabled="disableMenu" @triggerColor="setColor">
        <a-button @mousedown.prevent type="text" class="shadow-btn-wrapper small dropdown-trigger" :disabled="disableMenu">
          <caret-down-outlined />
        </a-button>
      </color-picker>
    </div>
  </s-keymap-tip>
</template>

<script setup lang="ts">
import { PropType, ref, computed } from 'vue'
import { Editor } from '@tiptap/core'
import ColorPicker from '@st/components/colorPicker/index.vue'
import { type ColorType } from '@st/components/colorPicker/data'
import { CaretDownOutlined } from '@ant-design/icons-vue'
import { Title } from '@st/extensions/title'
import { useActive } from '@st/hooks/useActive'
import { useMenuButtonEvents } from '@st/hooks/useMenuButtonEvents'
import { getShortcutTipByKey } from '@st/helpers/registKeyMap'
import { useSpeedEditor } from '@st/hooks/useSpeedEditorContext';
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const isTitleActive = useActive(props.editor, Title.name)
const { editableCpt } = useSpeedEditor();


const curColor = ref<ColorType>('#000000'); // 这里不使用选中回显

// 获取快捷键文本
const keyMap = getShortcutTipByKey('textColor')

// 禁用菜单
const disableMenu = computed(() => {
  return isTitleActive.value || !editableCpt.value || !props.editor.isEditable
})
const setColor = (color: ColorType) => {
  if (isTitleActive.value || !color) {
    return
  }
  curColor.value = color;
  props.editor?.chain().focus().setColor(color).run()
}
const buttonEvents = useMenuButtonEvents(() => setColor(curColor.value), 'menu')
</script>

<style scoped lang="less">
.text-color-menu-wrapper {
  display: flex;
  justify-items: center;

  .text-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
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
