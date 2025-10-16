<script setup>image导出功能
</script>

### 基础示例(已废弃，直接跳转单独部署的页面)

[查看示例](http://localhost:3000/){target="_blank"} 

```vue
<script setup>
import { ref } from "vue";
import { SpeedTiptapEditor } from "@/main";

const content = ref("<p>欢迎使用 Speed Tiptap Editor！</p>");

const onUpdate = (content) => {
  console.log(content);
};
</script>

<template>
  <SpeedTiptapEditor v-model:content="content" @update="onUpdate" />
</template>

<style scoped></style>
```

<Basic/>
