<!--
 * @Author: ykx
 * @Date: 2022-11-18 14:32:14
 * @LastEditTime: 2022-11-18 16:38:16
 * @LastEditors: your name
 * @Description: 字号显示
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\fontSize.vue
-->

<template>
  <div class="select shadow-bg-wrapper">
    <a-select
      :value="currentFontSize"
      :disabled="isTitleActive"
      dropdown-class-name="font-size-dropdown"
      :options="fontSizeOptions"
      @change="handleChange"
    >
      <template #option="{ value: val, label }">
        <span class="place-check-icon">
          <check-outlined v-if="currentFontSize === val" />
        </span>
        {{ label }}
      </template>
    </a-select>
  </div>
</template>

<script setup lang="ts">
import { PropType, reactive } from 'vue'
import { Editor } from '@tiptap/core'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
import { useAttributes } from '@/hooks/useAttributes'
import { CheckOutlined } from '@ant-design/icons-vue'
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const isTitleActive = useActive(props.editor, Title.name)
const currentFontSize = useAttributes(props.editor, 'textStyle', { fontSize: '16px' }, attrs =>
  attrs.fontSize.replace('px', ''),
)
const fontSizeOptions = reactive([
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
])
const handleChange = (value: number) => {
  props.editor
    ?.chain()
    .focus()
    .setFontSize(value + 'px')
    .run()
}
</script>
<style lang="less">
.font-size-dropdown {
  .ant-select-item {
    line-height: initial;
  }
  .ant-select-item-option .ant-select-item-option-content {
    display: flex;
    align-items: center;
    .place-check-icon {
      width: 15px;
      font-size: 14px;
      margin-right: 5px;
    }
  }
}
</style>
<style scoped lang="less">
.shadow-bg-wrapper {
  :deep(.ant-select) {
    width: 110px;
  }
}
</style>
