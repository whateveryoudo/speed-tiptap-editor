<!--
 * @Author: ykx
 * @Date: 2022-11-23 09:42:32
 * @LastEditTime: 2022-11-24 17:59:53
 * @LastEditors: your name
 * @Description: CodeBlock Wrapper - Tiptap 3.0 版本
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\codeBlock\wrapper.vue
-->
<template>
  <NodeViewWrapper class="code-block">
    <div ref="wrapRef" :style="{ height: height + 'px' }">
      <a-flex vertical
        class="rounded-md h-full border border-solid border-[var(--ant-color-primary)] bg-[var(--speed-color-bg-gray)] relative">
        <!-- 工具条 -->
        <a-flex justify="space-between"
          class="p-2 border-rounded-lt-md border-rounded-rt-md border-b border-b-solid border-b-[var(--speed-color-border-gray)] bg-[var(--speed-color-bg-gray-1)]">
          <a-space>
            <a-button type="text" class="shadow-btn-wrapper">
              <CaretRightOutlined v-if="isExpanded" />
              <CaretDownOutlined v-else />
            </a-button>
            <a-input v-model="title" bordered="false" placeholder="请输入代码块名称" />
          </a-space>
          <a-space>
            <a-select :dropdownMatchSelectWidth="false" :bordered="false" class="shadow-ant-select" show-search
              :value="nodeAttrs.language" @change="(lan: string) => updateAttributes({ language: lan })"
              :options="languages">
            </a-select>
            <a-divider type="vertical" />
            <a-select :dropdownMatchSelectWidth="false" :bordered="false" class="shadow-ant-select"
              :value="nodeAttrs.theme" @change="(theme: string) => updateAttributes({ theme: theme })">
              <a-select-option value="github-light">github-light</a-select-option>
              <a-select-option value="github-dark">github-dark</a-select-option>
              <a-select-option value="atom-one-light">atom-one-light</a-select-option>
              <a-select-option value="atom-one-dark">atom-one-dark</a-select-option>
            </a-select>
          </a-space>
        </a-flex>
        <!-- 内容区 -->
        <div :class="[`hljs-theme-${nodeAttrs.theme}`,]" class="content-wrap flex-1 flex flex-col">
          <pre class='overflow-y-auto flex-1 border-rounded-bl-md border-rounded-br-md'><code><NodeViewContent class="hljs" as="code" /></code></pre>
        </div>
        <div class="resize-bottom" @pointerdown="startResize('bottom', $event)" />
      </a-flex>
    </div>
  </NodeViewWrapper>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { common, createLowlight } from 'lowlight'
import { useEdgeResize } from '@/hooks/useEdgeResize'
const props = defineProps(nodeViewProps)
const title = ref('');
const isExpanded = ref(false)
const lowlight = createLowlight(common)
const nodeAttrs = computed(() => props.node.attrs)
// 常用的编程语言列表
const languages = lowlight.listLanguages().map((language: string) => ({
  value: language,
  label: language
}))

// 使用通用四边缩放，仅启用 bottom 边（作用于外层容器高度）
const wrapRef = ref<HTMLElement | null>(null)
const { height, startResize } = useEdgeResize(wrapRef, { height: nodeAttrs.value.height }, { minHeight: 100 })

</script>

<style lang="less" scoped>
.code-block {
  position: relative;

}

.content-wrap {
  position: relative;
}

.resize-bottom {
  width: 56px;
  height: 8px;
  background-color: var(--speed-color-bg-gray-2);
  border-radius: 4px;
  position: absolute;
  bottom: -4px;
  left: 50%;
  margin-left: -28px;
  cursor: ns-resize;
}
</style>
