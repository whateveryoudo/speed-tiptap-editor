<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from 'ant-design-vue'
const route = useRoute();
const router = useRouter();
const content = ref("<p>欢迎使用 Speed Tiptap Editor！</p>");

const onUpdate = (content) => {
  console.log(content);
};
const currentDemo = ref();
const demos = [
  {
    name: "simple",
    title: "基础示例",
    description: "基础示例",
  },
  {
    name: "knowledge",
    title: "知识库示例(类似语雀)",
    description: "知识库示例(类似语雀)",
  },
  {
    name: "collaboration",
    title: "协同示例",
    description: "协同示例",
  },
  {
    name: "ai",
    title: "AI编写（待开发）",
    description: "AI编写（待开发）",
  },
];
const checkDemo = (name) => {
  console.log(currentDemo.value, name)
  if (currentDemo.value === name) {
    return;
  }
  if (name === "ai") {
    message.info('功能待开发');
    return;
  }
  router.push({
    path: '/',
    query: {
      demoType: name,
    },
  });
};
watch(
  () => route.query.demoType,
  (newVal) => {
    currentDemo.value = newVal || "simple";
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <h2>以下是Speed Tiptap Editor的示例</h2>
  <a-space class="mb-2">
    <a-button :type="currentDemo === demo.name ? 'link' : 'text'" @click="checkDemo(demo.name)" v-for="demo in demos"
      :key="demo.name">
      {{ demo.title }}
    </a-button>
  </a-space>
  <!-- 基础示例 -->
  <div class="px-2">
    <SpeedTiptapEditor v-model:content="content" @update="onUpdate" v-if="currentDemo === 'simple'" />
    <SpeedTiptapEditor v-model:content="content" @update="onUpdate" v-else-if="currentDemo === 'knowledge'"
      scene="knowledge" />
    <SpeedTiptapEditor v-model:content="content" @update="onUpdate" v-else-if="currentDemo === 'collaboration'"
      scene="collaboration" />
    <SpeedTiptapEditor v-model:content="content" @update="onUpdate" v-else-if="currentDemo === 'ai'" scene="ai" />
  </div>

</template>

<style scoped></style>
