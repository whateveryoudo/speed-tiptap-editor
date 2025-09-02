<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
const route = useRoute();
const router = useRouter();
// const content = ref('<p></p><img crossorigin="anonymous" src="//localhost:3005/attachment/preview/mdh0zic00qt3z0yuiqar?token=speed-test-token" width="240" height="264" file="[object File]"><p>asdas</p><p>asdasdasdsa</p><p>asdasdas</p><p>asdsadas</p>');
const content = ref(
  '<p>测试下表格</p><table style="min-width: 125px"><colgroup><col style="min-width: 25px"><col style="min-width: 25px"><col style="min-width: 25px"><col style="min-width: 25px"><col style="min-width: 25px"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p></p></th><th colspan="1" rowspan="1"><p></p></th><th colspan="1" rowspan="1"><p></p></th><th colspan="1" rowspan="1"><p></p></th><th colspan="1" rowspan="1"><p></p></th></tr><tr><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td></tr></tbody></table><p><div class="attachment" displaymode="title" file="[object File]" filename="测试excel新建表单 (1).xlsx" filesize="10142" filetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" fileid="mf1vxwsnbrna0ezoi8m"></div></p>'
);

const onUpdate = (content) => {
  console.log(content);
};
const currentDemo = ref();
const title = ref("");
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
  console.log(currentDemo.value, name);
  if (currentDemo.value === name) {
    return;
  }
  if (name === "ai") {
    message.info("功能待开发");
    return;
  }
  router.push({
    path: "/",
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
  <router-view />
  <a-space class="mb-2">
    <a-button
      :type="currentDemo === demo.name ? 'link' : 'text'"
      @click="checkDemo(demo.name)"
      v-for="demo in demos"
      :key="demo.name"
    >
      {{ demo.title }}
    </a-button>
  </a-space>
  <!-- 基础示例 -->
  <div class="px-2">
    <SpeedTiptapEditor
      v-model:content="content"
      v-model:title="title"
      v-if="currentDemo === 'simple'"
    />
    <SpeedTiptapEditor
      v-model:content="content"
      v-model:title="title"
      v-else-if="currentDemo === 'knowledge'"
      scene="knowledge"
    />
    <SpeedTiptapEditor
      v-model:content="content"
      v-model:title="title"
      v-else-if="currentDemo === 'collaboration'"
      scene="collaboration"
    />
    <SpeedTiptapEditor
      v-model:content="content"
      @update="onUpdate"
      v-else-if="currentDemo === 'ai'"
      scene="ai"
    />
  </div>
  <div>
    <a-space>标题:<a-input v-model:value="title" /></a-space>{{ content }}
  </div>
</template>

<style scoped></style>
