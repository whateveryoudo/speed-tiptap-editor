<!--
 * @Author: ykx
 * @Date: 2022-11-16 18:21:23
 * @LastEditTime: 2023-01-09 11:12:21
 * @LastEditors: your name
 * @Description: 气泡工具-标签（注意：updateAttr的时候，会导致节点失焦,这里配置大部分操作都是缓存起来，最后统一更新）
 * @FilePath: \we-knowledge-base\src\tiptap\editor\collaboration\bubbleMenus\ImageMenu\index.vue
-->
<template>
  <BubbleContainer :editor="editor" plugin-key="tag-bubble-menu" :should-show="shouldShow">
    <a-space :size="5">
      <a-input placeholder="请输入标签" v-model:value="customTagAttrs.text">
        <template #suffix>
          <CheckOutlined title="确认" @click="confirmUse" />
        </template>
      </a-input>
      <a-divider type="vertical" class="menu-divider" />
      <template v-for="(item, index) in fixedOptions" :key="item.color">
        <span :style="{ backgroundColor: item.bgColor }"
          class="shadow-btn-wrapper cursor-pointer w-[25px] h-[25px] rounded-[2px] flex items-center justify-center"
          @click="handleSelectOption(index)">
          <CheckOutlined v-if="index === selectedOptionIndex" :style="{ color: item.color }" />
          <span v-else :style="{ color: item.color }">A</span>
        </span>
      </template>
      <a-popover trigger="click" placement="right" v-model:open="customTagOpen">
        <template #content>
          <a-flex vertical :gap="20" class="w-[200px]">
            <a-flex :gap="5" align="center">
              <span class="flex-shrink-0">文字颜色:</span>
              <ColorPicker placement="right" class="flex-1  h-[15px]" :cur-color="customTagAttrs.color"
                @triggerColor="(color: string) => updateCustomTagAttrs({ color })">
                <span :style="{ backgroundColor: customTagAttrs.color }"
                  class="cursor-pointer border border-solid border-gray-200"></span>
              </ColorPicker>
            </a-flex>
            <a-flex :gap="5" align="center">
              <span class="flex-shrink-0">背景颜色:</span>
              <ColorPicker class="flex-1 h-[15px]" placement="right" :cur-color="customTagAttrs.bgColor"
                @triggerColor="(color: string) => updateCustomTagAttrs({ bgColor: color })">
                <span :style="{ backgroundColor: customTagAttrs.bgColor }"
                  class="cursor-pointer border border-solid border-gray-200"></span>
              </ColorPicker>
            </a-flex>
            <div class="flex justify-center mt-2">
              <span class="px-[6px] rounded-[4px] py-[2px]"
                :style="{ color: customTagAttrs.color, backgroundColor: customTagAttrs.bgColor }">{{ customTagAttrs.text
                  || '示例标签' }}</span>
            </div>
            <a-flex justify="end">
              <a-space>
                <a-button type="default" size="small" @click="customTagOpen = false">取消</a-button>
                <a-button type="primary" size="small" @click="confirmUse">使用</a-button>
              </a-space>
            </a-flex>

          </a-flex>
        </template>
        <a-button type="primary" @click="handleCustomTag" size="small"> 自定义 </a-button>
      </a-popover>
    </a-space>
  </BubbleContainer>
</template>

<script setup lang="ts">
import { PropType, computed, ref, watch } from "vue";
import BubbleContainer from "../BubbleContainer.vue";
import { Tag } from "@/extensions/tag";
import { useAttributes } from "@/hooks/useAttributes";
import { type Editor } from "@tiptap/core";
import ColorPicker from "@/components/colorPicker/index.vue";
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
});

const customTagOpen = ref(false);
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
// 临时缓存属性
const customTagAttrs = ref<{
  text: string;
  color: string;
  bgColor: string;
}>({
  text: attributes.value.text,
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

const updateCustomTagAttrs = (attrs: any) => {
  customTagAttrs.value = {
    ...customTagAttrs.value,
    ...attrs,
  };
};
// 直接调用属性更新
const handleUpdateAttributes = (attrs: any) => {
  props.editor?.chain().focus().updateAttributes(Tag.name, attrs).run();
};
const handleSelectOption = (index: number) => {
  handleUpdateAttributes(fixedOptions[index]);
};
const handleCustomTag = () => {
  customTagOpen.value = true;
};
const confirmUse = () => {
  customTagOpen.value = false;
  handleUpdateAttributes(customTagAttrs.value);
};
// 这里只监听tag选中
watch(isActiveTag, (newVal: boolean) => {
  if (newVal) {
    customTagAttrs.value.text = attributes.value.text;
    customTagAttrs.value.color = attributes.value.color;
    customTagAttrs.value.bgColor = attributes.value.bgColor;
  }
}, {
  immediate: true,
});

</script>

<style scoped lang="less"></style>
