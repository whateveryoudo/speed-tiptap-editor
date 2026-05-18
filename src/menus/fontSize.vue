<!--
 * @Author: ykx
 * @Date: 2022-11-18 14:32:14
 * @LastEditTime: 2022-11-18 16:38:16
 * @LastEditors: your name
 * @Description: 字号显示
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\fontSize.vue
-->

<template>
  <a-select :bordered="false" class="w-[80px] shadow-ant-select" :value="currentFontSize" :disabled="!editableCpt || isTitleActive"
    popupClassName="popover-check-dropdown" :options="fontSizeOptions" @change="handleChange">
    <template #option="{ value: val, label }">
      <span class="place-check-icon">
        <check-outlined v-if="currentFontSize === val" />
      </span>
      {{ label }}
    </template>
    <template #suffixIcon>
      <CaretDownOutlined :style="{ color: (!isTitleActive && editableCpt) ? 'rgba(0, 0, 0, 0.88)' : 'rgba(0, 0, 0, 0.25)' }" />
    </template>
  </a-select>
</template>

<script setup lang="ts">
import { type PropType, inject, computed, ref, type Ref } from 'vue'
import { Editor } from '@tiptap/core'
import { Title } from '@st/extensions/title'
import { useActive } from '@st/hooks/useActive'
import { useAttributes } from '@st/hooks/useAttributes'
import { CheckOutlined, CaretDownOutlined } from '@ant-design/icons-vue'
import { useSpeedEditor } from '@st/hooks/useSpeedEditorContext';
const { speedTiptapConfig, editableCpt } = useSpeedEditor();
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const isTitleActive = useActive(props.editor, Title.name)
const currentFontSize = useAttributes(props.editor, 'textStyle', { fontSize: speedTiptapConfig?.value?.fontSize?.default ?? '14px' }, attrs =>
  attrs.fontSize.replace('px', ''),
)
const fontSizeOptions = computed(() => {
  return speedTiptapConfig?.value?.fontSize?.options ?? [
    { value: '12', label: '12px' },
    { value: '13', label: '13px' },
    { value: '14', label: '14px' },
    { value: '15', label: '15px' },
    { value: '16', label: '16px' },
    { value: '19', label: '19px' },
    { value: '22', label: '22px' },
    { value: '24', label: '24px' },
    { value: '29', label: '29px' },
    { value: '32', label: '32px' },
    { value: '40', label: '40px' },
    { value: '48', label: '48px' },
  ]
})
const handleChange = (value: number) => {
  props.editor
    ?.chain()
    .focus()
    .setFontSize(value + 'px')
    .run()
}
</script>
