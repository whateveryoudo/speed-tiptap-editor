<!--
 * @Author: ykx
 * @Date: 2022-11-16 18:21:23
 * @LastEditTime: 2023-01-09 11:12:21
 * @LastEditors: your name
 * @Description: 气泡工具-高亮块
 * @FilePath: \we-knowledge-base\src\tiptap\editor\collaboration\bubbleMenus\ImageMenu\index.vue
-->
<template>
  <div v-if="isVisible" ref="floatingElement" class="bubble-menu-wrapper absolute z-[500]">
    <a-space :size="5">
      <template v-for="(item, index) in fixedOptions" :key="item.color">
        <span :style="{ backgroundColor: item.bgColor }"
          class="shadow-btn-wrapper cursor-pointer w-[25px] h-[25px] rounded-[2px] flex items-center justify-center"
          @click="handleSelectOption(index)">
          <CheckOutlined v-if="index === selectedOptionIndex" :style="{ color: item.color }" />
          <span v-else :style="{ color: item.color }">A</span>
        </span>
      </template>
      <a-popover trigger="click" placement="right">
        <template #content>
          <a-flex vertical :gap="20" class="w-[150px]">
            <a-flex :gap="5" align="center">
              <span class="flex-shrink-0">文字颜色:</span>
              <ColorPicker placement="right" class="flex-1  h-[15px]" :cur-color="attributes.color"
                @triggerColor="(color: string) => handleUpdateAttributes({ color })">
                <span :style="{ backgroundColor: attributes.color }"
                  class="cursor-pointer border border-solid border-gray-200"></span>
              </ColorPicker>
            </a-flex>
            <a-flex :gap="5" align="center">
              <span class="flex-shrink-0">背景颜色:</span>
              <ColorPicker class="flex-1 h-[15px]" placement="right" :cur-color="attributes.bgColor"
                @triggerColor="(color: string) => handleUpdateAttributes({ bgColor: color })">
                <span :style="{ backgroundColor: attributes.bgColor }"
                  class="cursor-pointer border border-solid border-gray-200"></span>
              </ColorPicker>
            </a-flex>
          </a-flex>
        </template>
        <a-button type="primary" size="small"> 自定义 </a-button>
      </a-popover>
      <a-divider type="vertical" class="menu-divider" />
      <a-tooltip title="头部图标">
        <emoji-picker @triggerEmoji="(emoji: string) => handleUpdateAttributes({ icon: emoji })">
          <a-button type="text" class="shadow-btn-wrapper">
            <s-icon-font type="icon-kl-emoji" :size="18" />
          </a-button>
        </emoji-picker>
      </a-tooltip>
      <a-tooltip title="移除图标">
        <a-button type="text" class="shadow-btn-wrapper" @click="handleUpdateAttributes({ icon: null })">
          <MinusCircleOutlined />
        </a-button>
      </a-tooltip>
      <a-divider type="vertical" class="menu-divider" />
      <a-tooltip title="删除">
        <a-button type="text" class="shadow-btn-wrapper" @click="handleDelNode('callout')">
          <DeleteOutlined />
        </a-button>
      </a-tooltip>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, onMounted, onUnmounted, ref } from "vue";
import { useAttributes } from "@speed-tiptap-editor/composables";
import { type Editor } from "@tiptap/core";
import ColorPicker from "@kb/components/colorPicker/index.vue";
import { useNodeTopCenterBubble } from "@kb/bubbleMenus/useNodeTopCenterBubble";
import { MinusCircleOutlined } from "@ant-design/icons-vue";
import EmojiPicker from "@kb/components/emojiPicker/index.vue";
import { useBubble } from "@kb/hooks/useBubble";
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    default: () => ({}),
  },
});

const fixedOptions = [
  { color: "#000", bgColor: "rgba(181,239,242,0.5)" },
  { color: "#000", bgColor: "rgba(199,240,223,0.5)" },
  { color: "#000", bgColor: "rgba(248,214,185,0.5)" },
  { color: "#000", bgColor: "rgba(247,196,226,0.5)" },
  { color: "#000", bgColor: "rgba(217,201,248,0.5)" },
];
const { handleDelNode } = useBubble(props?.editor, {});
const attributes = useAttributes<{
  color: string;
  bgColor: string;
}>(props.editor, 'callout', {
  color: "",
  bgColor: "",
});

// 这里通过bgColor来判断选中的选项
const selectedOptionIndex = computed(() => {
  const tagetIndex = fixedOptions.findIndex(item => item.bgColor === attributes.value.bgColor);
  if (tagetIndex === -1) {
    return 0;
  }
  return tagetIndex;
});
const isActiveCallout = computed(() => {
  return props.editor?.isActive('callout');
});
// 固定气泡：定位到 callout 容器顶部中间
const { isVisible, floatingElement, getAnchorFromSelection, showBubble, handleTransaction } =
  useNodeTopCenterBubble(props.editor as Editor, {
    nodeName: 'callout',
    requireEmptySelection: true,
    extraShouldShow: (ed) => ed.isActive('callout'),
    hideWhenScroll: true,
  })
// 1) 监听容器内点击：直接显示（不等 selectionUpdate）
const onDocMouseDown = (e: MouseEvent) => {
  // 这里添加延迟，可能光标还没进入callout容器
  setTimeout(() => {
    const anchor = getAnchorFromSelection();
    if (anchor && anchor.contains(e.target as Node)) {
      if (isActiveCallout.value) {
        showBubble()
      }
    }
  }, 100)
}
onMounted(() => {
  document.addEventListener('mousedown', onDocMouseDown, true)

  props.editor?.on('transaction', handleTransaction)
})

onUnmounted(() => {
  props.editor?.off('transaction', handleTransaction)
})


// 直接调用属性更新(这里追加setNodeSelection，保证更新属性后节点依然选中气泡不消失）
const handleUpdateAttributes = (attrs: any) => {
  props.editor?.chain().focus().command(({ tr }) => { tr.setMeta('keep' + 'callout' + 'Bubble', true); return true })
    .updateAttributes('callout', attrs).run();
};
const handleSelectOption = (index: number) => {
  handleUpdateAttributes(fixedOptions[index]);
};




</script>

<style scoped lang="less"></style>
