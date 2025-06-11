<template>
  <div class="demo-block">
    <div class="demo-content">
      <slot />
    </div>
    <div class="demo-code-control">
      <a-space :size="16">
        <span class="control-item" @click="copyCode">
          <CopyOutlined />
          <span class="ml-1">复制代码</span>
        </span>
        <span class="control-item" @click="toggleCode">
          <CaretUpOutlined v-if="expanded" />
          <CaretDownOutlined v-else />
          <span class="ml-1">{{ expanded ? "收起代码" : "查看代码" }}</span>
        </span>
      </a-space>
    </div>
    <div v-show="expanded" class="demo-code">
      <highlightjs :code="code" language="vue" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { message } from "ant-design-vue";
import "highlight.js/lib/common";
import "highlight.js/styles/stackoverflow-light.css";
// fix:构建时有问题，参考https://github.com/vuejs/vitepress/issues/1905
import hljsVuePlugin from "@highlightjs/vue-plugin";
const Highlightjs = hljsVuePlugin.component;

const props = defineProps<{
  code: string;
}>();

const expanded = ref(false);

const toggleCode = () => {
  expanded.value = !expanded.value;
};

const copyCode = async () => {
  if (props.code) {
    try {
      await navigator.clipboard.writeText(props.code);
      message.success("代码已复制到剪贴板");
    } catch (err) {
      message.error("复制失败");
    }
  }
};
</script>

<style scoped lang="less">
.demo-block {
  border: 1px solid #ebedf1;
  border-radius: 2px;
  margin: 16px 0;
}

.demo-content {
  padding: 24px;
}

.demo-code-control {
  border-top: 1px solid #ebedf1;
  height: 44px;
  box-sizing: border-box;
  background-color: #fff;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  text-align: center;
  margin-top: -1px;
  color: #909399;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: all 0.3s;
}

.demo-code-control .control-item:hover {
  color: #1677ff;
  background-color: #f9fafc;
}

.control-text {
  margin-left: 8px;
  font-size: 14px;
}

.demo-code {
  background-color: #fafafa;
  border-top: 1px solid #ebedf1;
  padding: 16px;
}

.code-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

:deep(.hljs) {
  background: transparent;
  padding: 0;
  margin: 0;
}

:deep(.hljs code) {
  font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
  font-size: 14px;
  line-height: 1.5;
}

:deep(pre) {
  margin: 0;
  padding: 0;
  background: transparent;
}
/* 一些样式处理(vitepress覆盖问题) */
.demo-content {
  p {
    margin-bottom: 0px;
  }
  li {
    margin: 0
  }
  :deep(table) {
    margin:0;
    // border-collapse: separate;
    display: table; // vite-press会影响自适应宽度
  }
  :deep(.ant-pagination) {
    li{
      margin-top: 0;
    }
  }
  :deep(.ant-pagination-options) {
    margin-top: 0;
  }
}
</style>
