<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { useGlobalStore } from "#example/store/index";
import { speedTiptapLogin } from "#example/api/user";
import { fileDownload, fileUploadSingle, fileUploadMulti, fileDel } from "#example/api/attachement";
const route = useRoute();
const router = useRouter();
// const content = ref('<p></p><img crossorigin="anonymous" src="//localhost:3005/attachment/preview/mdh0zic00qt3z0yuiqar?token=speed-test-token" width="240" height="264" file="[object File]"><p>asdas</p><p>asdasdasdsa</p><p>asdasdas</p><p>asdsadas</p>');
const content = ref(
  // '<p>测试下表格</p><table style="min-width: 125px"><colgroup><col style="min-width: 25px"><col style="min-width: 25px"><col style="min-width: 25px"><col style="min-width: 25px"><col style="min-width: 25px"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p></p></th><th colspan="1" rowspan="1"><p></p></th><th colspan="1" rowspan="1"><p></p></th><th colspan="1" rowspan="1"><p></p></th><th colspan="1" rowspan="1"><p></p></th></tr><tr><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td></tr></tbody></table><p><img crossorigin="anonymous" src="//localhost:3005/attachment/preview/mfqgzacd3u35cf1w3nd?token=speed-test-token" width="240" height="264" file="[object File]" originalwidth="240" originalheight="264"></p><p><div class="attachment" displaymode="title" file="[object File]" filename="测试excel新建表单 (1).xlsx" filesize="10142" filetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" fileid="mf1vxwsnbrna0ezoi8m"></div></p><p></p>'
  // '<pre><code class="language-auto"></code></pre><p></p>'
  // '<div data-type="callout" data-bg-color="rgba(217,201,248,0.5)" data-color="#000000" style="background-color: rgba(217,201,248,0.5); color: #000000;"><p>我是测试高亮块</p><p>啊啊啊</p></div><p></p>'
  ''
);

const currentDemo = ref();
const title = ref("");
const globalStore = useGlobalStore();
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
    description: "你需要启动后端服务和数据库，请参考https://github.com/whateveryoudo/speed-apis,【启动成功后你可以使用两个浏览器输入查看效果】",
  },
];
const checkDemo = (name: string) => {
  if (currentDemo.value === name) {
    return;
  }

  router.push({
    path: "/",
    query: {
      demoType: name,
    },
  });
};
const handleOpenJwtChange = async (checked: boolean) => {
  if (!checked) {
    localStorage.removeItem("speed-tiptap-token");
    return;
  }
  // 这里写死了，目前没涉及到登录
  const { data } = await speedTiptapLogin({
    username: "ykx",
    password: "123456",
  });
  const token = (data && (data.token || data)) || "";
  if (token) {
    localStorage.setItem("speed-tiptap-token", token);
  }
};
// 切换重置值
watch(() => route.query.demoType, () => {
  content.value = ''; // 重置内容
  title.value = ''; // 重置标题
}, {
  immediate: true,
});
const simpleProps = {
  upload: {
    uploadApis: {
      fileDownload: fileDownload,
      fileUploadSingle: fileUploadSingle,
      fileUploadMulti: fileUploadMulti,
      fileDel: fileDel,
      // 主要用于图片预览
      getPreviewUrl: (fileId: string) => {
        // 实际情况替换为实际地址(此处为本地启动的node附件服务)
        const globalStore = useGlobalStore();
        const token = globalStore.openJwt ? localStorage.getItem('speed-tiptap-token') : 'speed-test-token'; // 未开启jwt 则使用一个模拟值
        return "//localhost:3005/attachment/preview/" + fileId + `?token=${token}`;
      },
      // 主要用于文件预览
      getFilePreviewUrl: (fileId: string) => {
        // 实际情况替换为实际地址(此处为本地启动的node附件服务)
        const globalStore = useGlobalStore();
        const token = globalStore.openJwt ? localStorage.getItem('speed-tiptap-token') : 'speed-test-token'; // 未开启jwt 则使用一个模拟值
        return "//localhost:3005/onlyoffice/filePreview/" + fileId + `?token=${token}`;
      },
    },
  }
}

const knowledgeProps = {
  upload: {
    uploadApis: {
      fileDownload: fileDownload,
      fileUploadSingle: fileUploadSingle,
      fileUploadMulti: fileUploadMulti,
      fileDel: fileDel,
      // 主要用于图片预览
      getPreviewUrl: (fileId: string) => {
        // 实际情况替换为实际地址(此处为本地启动的node附件服务)
        const globalStore = useGlobalStore();
        const token = globalStore.openJwt ? localStorage.getItem('speed-tiptap-token') : 'speed-test-token'; // 未开启jwt 则使用一个模拟值
        return "//localhost:3005/attachment/preview/" + fileId + `?token=${token}`;
      },
      // 主要用于文件预览
      getFilePreviewUrl: (fileId: string) => {
        // 实际情况替换为实际地址(此处为本地启动的node附件服务)
        const globalStore = useGlobalStore();
        const token = globalStore.openJwt ? localStorage.getItem('speed-tiptap-token') : 'speed-test-token'; // 未开启jwt 则使用一个模拟值
        return "//localhost:3005/onlyoffice/filePreview/" + fileId + `?token=${token}`;
      },
    },
  },
  // 增加ai配置： 目前仅支持 豆包大模型 配置
  ai: {
    doubao: {
      // 对应后端请求（这里不要将敏感参数暴露在前端）
      url: '//localhost:3005/ai/doubao/stream',
      header: {
        'Authorization': `Bearer ${globalStore.openJwt ? localStorage.getItem('speed-tiptap-token') : 'speed-test-token'}`, // 未开启jwt 则使用一个模拟值
      },
      // 你可以自定义请求参数传入,构建系统的提示词（AIAction = 'refactor' | 'check' | 'simple' | 'rich' | 'translate' | 'summary' | 'custom'，content-编辑器选择的文本，customPrompt-用户输入的提示词）
      bodyParams: (action: string, content: string, customPrompt: string): Record<string, any> => {
        return {
          action,
          content,
          customPrompt,
        }
      }
    }
  }
}

// 协同配置（目前仅有基础协同：TODO:配置详细的auth,version）
const collaborateProps = {
  upload: {
    uploadApis: {
      fileDownload: fileDownload,
      fileUploadSingle: fileUploadSingle,
      fileUploadMulti: fileUploadMulti,
      fileDel: fileDel,
      // 主要用于图片预览
      getPreviewUrl: (fileId: string) => {
        // 实际情况替换为实际地址(此处为本地启动的node附件服务)
        const globalStore = useGlobalStore();
        const token = globalStore.openJwt ? localStorage.getItem('speed-tiptap-token') : 'speed-test-token'; // 未开启jwt 则使用一个模拟值
        return "//localhost:3005/attachment/preview/" + fileId + `?token=${token}`;
      },
      // 主要用于文件预览
      getFilePreviewUrl: (fileId: string) => {
        // 实际情况替换为实际地址(此处为本地启动的node附件服务)
        const globalStore = useGlobalStore();
        const token = globalStore.openJwt ? localStorage.getItem('speed-tiptap-token') : 'speed-test-token'; // 未开启jwt 则使用一个模拟值
        return "//localhost:3005/onlyoffice/filePreview/" + fileId + `?token=${token}`;
      },
    },
  },
  // 增加ai配置： 目前仅支持 豆包大模型 配置
  ai: {
    doubao: {
      // 对应后端请求（这里不要将敏感参数暴露在前端）
      url: '//localhost:3005/ai/doubao/stream',
      header: {
        'Authorization': `Bearer ${globalStore.openJwt ? localStorage.getItem('speed-tiptap-token') : 'speed-test-token'}`, // 未开启jwt 则使用一个模拟值
      },
      // 你可以自定义请求参数传入,构建系统的提示词（AIAction = 'refactor' | 'check' | 'simple' | 'rich' | 'translate' | 'summary' | 'custom'，content-编辑器选择的文本，customPrompt-用户输入的提示词）
      bodyParams: (action: string, content: string, customPrompt: string): Record<string, any> => {
        return {
          action,
          content,
          customPrompt,
        }
      }
    }
  },
  collaboration: {
    url: 'ws://localhost:3005/collaboration',// 请先启动后端服务
    token: globalStore.openJwt ? localStorage.getItem('speed-tiptap-token') : 'speed-test-token' // 未开启jwt 则使用一个模拟值
  }
}


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
  <a-flex align="center" class="mb-2">
    <a-switch v-model:checked="globalStore.openJwt" @change="handleOpenJwtChange"></a-switch><span
      class="ml-2 text-sm text-gray-500">是否开启登录jwt校验(文档可能需要配合后端示例服务启动，开启后会模拟登录jwt，接口也会有token校验)</span>
  </a-flex>
  <router-view />
  <a-space class="mb-2">
    <template v-for="demo in demos" :key="demo.name">
      <a-tooltip :title="demo.description">
        <a-button :type="currentDemo === demo.name ? 'link' : 'text'" @click="checkDemo(demo.name)"
          >
          {{ demo.title }}
        </a-button>
      </a-tooltip>
    </template>

  </a-space>
  <!-- 基础示例 -->
  <div class="px-2 h-[600px]">
    <SpeedTiptapEditor v-model:content="content" v-model:title="title" v-if="currentDemo === 'simple'"
      v-bind="simpleProps" />
    <!-- 先不要绑定json 会导致实时变化 -->
    <SpeedTiptapEditor v-model:content="content" v-model:title="title" v-else-if="currentDemo === 'knowledge'"
      scene="knowledge" v-bind="knowledgeProps" />
    <SpeedTiptapEditor v-model:content="content" v-model:title="title" v-else-if="currentDemo === 'collaboration'"
      scene="knowledge" v-bind="collaborateProps" />
  </div>
  <div v-if="currentDemo === 'knowledge'">
    <a-space>标题:<a-input v-model:value="title" /></a-space>
    <!-- {{ content }} -->
  </div>
</template>

<style scoped></style>
