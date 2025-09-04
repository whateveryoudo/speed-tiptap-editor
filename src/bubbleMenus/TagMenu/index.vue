<!--
 * @Author: ykx
 * @Date: 2022-11-16 18:21:23
 * @LastEditTime: 2023-01-09 11:12:21
 * @LastEditors: your name
 * @Description: 气泡工具-标签
 * @FilePath: \we-knowledge-base\src\tiptap\editor\collaboration\bubbleMenus\ImageMenu\index.vue
-->
<template>
  <BubbleContainer
    :editor="editor"
    plugin-key="tag-bubble-menu"
    :should-show="shouldShow"
  >
    <a-space :size="5">
      <a-input placeholder="请输入标签"></a-input>
      <a-divider type="vertical" class="menu-divider" />
      <template v-for="(item, index) in fixedOptions" :key="item.color">
        <span
          :style="{ backgroundColor: item.bgColor }"
          class="shadow-btn-wrapper"
          @click="handleSelectOption(index)"
        >
          <CheckOutlined
            v-if="index === selectedOptionIndex"
            :color="item.color"
          />
          <span :style="{ color: item.color }">A</span>
        </span>
      </template>
      <a-button type="primary" @click="handleCustomTag"> 自定义 </a-button>
    </a-space>
  </BubbleContainer>
</template>

<script setup lang="ts">
import { PropType, computed, ref } from "vue";
import BubbleContainer from "../BubbleContainer.vue";
import { Tag } from "@/extensions/tag";
import { useAttributes } from "@/hooks/useAttributes";
import { type Editor } from "@tiptap/core";
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
});
const fixedOptions = [
  { color: "rgb(153, 153, 153)", bgColor: "rgba(0, 0, 0, 0.05)" },
  { color: "rgb(200, 78, 67)", bgColor: "rgb(252, 223, 220)" },
  { color: "rgb(63, 133, 255)", bgColor: "rgb(217, 231, 255)" },
  { color: "rgb(240, 196, 23)", bgColor: "rgb(255, 245, 210)" },
  { color: "rgb(5, 205, 153)", bgColor: "rgb(205, 245, 235)" },
];
const attributes = useAttributes<{
  text: string;
  color: string;
  bgColor: string;
}>(props.editor, Tag.name, {
  text: "",
  color: "",
  bgColor: "",
});
// 这里通过color和bgColor来判断选中的选项
const selectedOptionIndex = computed(() => {
  const tagetIndex = fixedOptions.findIndex(item => item.color === attributes.value.color && item.bgColor === attributes.value.bgColor);
  if (tagetIndex === -1) {
    return 0;
  }
  return tagetIndex;
});
const isActiveTag = computed(() => {
  return props?.editor.isActive(Tag.name);
});

const shouldShow = () => {
  return (
    props?.editor?.isEditable &&
    !props?.editor.view.state.selection.empty &&
    isActiveTag.value
  );
};

// 直接调用属性更新
const handleUpdateAttributes = (attrs: any) => {
  props.editor?.chain().focus().updateAttributes(Tag.name, attrs).run();
};
const handleSelectOption = (index: number) => {
  handleUpdateAttributes(fixedOptions[index]);
};
const handleCustomTag = () => {};
</script>

<style scoped lang="less"></style>
