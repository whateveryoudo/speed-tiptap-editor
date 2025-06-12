<!--
 * @Author: ykx
 * @Date: 2022-11-23 09:42:32
 * @LastEditTime: 2022-11-24 17:59:53
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\codeBlock\wrapper.vue
-->
<template>
  <NodeViewWrapper class="code-block">
    <select
      v-model="selectedLanguage"
      contenteditable="false"
    >
      <option value="auto">
        auto
      </option>
      <option disabled>
        —
      </option>
      <option
        v-for="(language, index) in languages"
        :key="index"
        :value="language"
      >
        {{ language }}
      </option>
    </select>
    <pre><code><NodeViewContent as="code" /></code></pre>
  </NodeViewWrapper>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
const props = defineProps(nodeViewProps)

const languages = ref(props.extension.options.lowlight.listLanguages())

const selectedLanguage = computed({
  get() {
    return props.node.attrs.language
  },
  set(language: string) {
    props.updateAttributes({ language })
  },
})
</script>

<style lang="less" scoped>
.code-block {
  position: relative;

  select {
    z-index: 10;
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }
}
</style>
