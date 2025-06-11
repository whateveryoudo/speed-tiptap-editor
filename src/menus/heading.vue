<!--
 * @Author: ykx
 * @Date: 2022-11-15 16:55:26
 * @LastEditTime: 2022-11-18 16:39:08
 * @LastEditors: your name
 * @Description: 文字选择
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\heading.vue
-->
<template>
  <div class="select shadow-bg-wrapper">
    <a-select
      :value="current"
      :disabled="isTitleActive"
      dropdown-class-name="heading-dropdown"
      :options="headingOptions"
      @change="handleChange"
    >
      <template #option="{ value: val, label, style }">
        <span class="place-check-icon">
          <check-outlined v-if="current === val" />
        </span>
        <span :style="val === 'paragraph' ? { fontWeight: 'normal' } : style">
          {{ label }}
        </span>
      </template>
    </a-select>
  </div>
</template>

<script setup lang="ts">
import { PropType, reactive, computed } from 'vue'
import { Editor } from '@tiptap/core'
import { Title } from '@/extensions/title'
import { useActive } from '@/hooks/useActive'
import { CheckOutlined } from '@ant-design/icons-vue'
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
})
const isTitleActive = useActive(props.editor, Title.name)
const isH1Active = useActive(props.editor, 'heading', { level: 1 })
const isH2Active = useActive(props.editor, 'heading', { level: 2 })
const isH3Active = useActive(props.editor, 'heading', { level: 3 })
const isH4Active = useActive(props.editor, 'heading', { level: 4 })
const isH5Active = useActive(props.editor, 'heading', { level: 5 })
const isH6Active = useActive(props.editor, 'heading', { level: 6 })
const current = computed(() => {
  if (isH1Active.value) {
    return '1'
  } else if (isH2Active.value) {
    return '2'
  } else if (isH3Active.value) {
    return '3'
  } else if (isH4Active.value) {
    return '4'
  } else if (isH5Active.value) {
    return '5'
  } else if (isH6Active.value) {
    return '6'
  } else {
    return 'paragraph'
  }
})
const headingOptions = reactive([
  { value: 'paragraph', label: '正文' },
  { value: '1', label: '标题1', style: { fontSize: '1.3em' } },
  { value: '2', label: '标题2', style: { fontSize: '1.1em' } },
  { value: '3', label: '标题3', style: { fontSize: '1.0em' } },
  { value: '4', label: '标题4', style: { fontSize: '0.9em' } },
  { value: '5', label: '标题5', style: { fontSize: '0.8em' } },
  { value: '6', label: '标题6', style: { fontSize: '0.8em' } },
])
const handleChange = (value: string) => {
  if (value === 'paragraph') {
    props.editor?.chain().focus().setParagraph().run()
  } else {
    props.editor
      ?.chain()
      .focus()
      .toggleHeading({ level: Number(value) as any })
      .run()
  }
}
</script>
<style lang="less">
.heading-dropdown {
  .ant-select-item {
    line-height: initial;
  }
  .ant-select-item-option .ant-select-item-option-content {
    display: flex;
    align-items: center;
    font-weight: 600;
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
