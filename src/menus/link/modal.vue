<!--
 * @Author: ykx
 * @Date: 2022-11-17 11:20:28
 * @LastEditTime: 2023-01-09 16:19:58
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\menus\link\modal.vue
-->
<template>
  <s-draggable-modal
    :visible="visible"
    title="编辑链接"
    @cancel="emit('closeModal')"
    @ok="handleSubmit"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 15 }"
      autocomplete="off"
    >
      <a-form-item
        label="文本"
        name="text"
      >
        <a-input
          v-model:value="formState.text"
          allow-clear
          placeholder="描述"
        />
      </a-form-item>

      <a-form-item
        label="链接"
        name="href"
        :rules="[{ validator: validLink, required: true }]"
      >
        <a-input
          v-model:value="formState.href"
          allow-clear
          placeholder="链接地址"
        />
      </a-form-item>
    </a-form>
  </s-draggable-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { linkModalProps } from './modal'
import { isValidURL } from '@/prose-utils'
const props = defineProps(linkModalProps)
const emit = defineEmits(['closeModal'])
const formRef = ref(null)
const formState = reactive({
  text: '',
  href: '',
})
const validLink = (_: any, value: string) => {
  if (!isValidURL(value)) {
    return Promise.reject('请输入有效链接')
  }
  return Promise.resolve()
}

const handleSubmit = async () => {
  if (!formRef.value) {
    return
  }
  try {
    const values = await (formRef.value as any)?.validateFields()
    const { from, to } = props
    const { view } = props.editor
    const schema = view.state.schema
    const node = schema.text(values.text, [schema.marks.link.create({ href: values.href })])

    view.dispatch(view.state.tr.deleteRange(from, to))
    view.dispatch(view.state.tr.insert(from, node))
    view.dispatch(view.state.tr.scrollIntoView())
    emit('closeModal');
  } catch (error) {
    console.log(error)
  }
}
watch(() => props.visible, (val: boolean) => {
  if (val) {
    formState.text = props.href;
    formState.href = props.href;
  }
})
</script>

<style scoped lang="less"></style>
