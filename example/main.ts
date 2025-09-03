import { createApp } from "vue";
import App from "./App.vue";
import router from "./src/router";
import SpeedTiptapEditor from "../src/main";
import { createPinia } from 'pinia';
import { useGlobalStore } from '#example/store/index';
import "uno.css";

import {
  fileDownload,
  fileUploadSingle,
  fileUploadMulti,
  fileDel,
} from "./src/api/attachement";
// 配置一些请求地址，用于上传文件
createApp(App)
  .use(router)
  .use(createPinia())
  .use(SpeedTiptapEditor, {
    apis: {
      fileDownload: fileDownload,
      fileUploadSingle: fileUploadSingle,
      fileUploadMulti: fileUploadMulti,
      fileDel: fileDel,
      // 主要用于图片预览
      getPreviewUrl: (fileId: string) => {
        const globalStore = useGlobalStore();
        const token = globalStore.openJwt ? localStorage.getItem('speed-tiptap-token') : 'speed-test-token'; // 未开启jwt 则使用一个模拟值
        return "//localhost:3005/attachment/preview/" + fileId + `?token=${token}`;
      },
      // 此地址为onlyoffice的预览地址（这里用于附件预览）
      getOfficePreviewUrl: (fileId: string) => {
        // 实际情况替换为实际地址(此处为本地启动的node附件服务)
        const globalStore = useGlobalStore();
        const token = globalStore.openJwt ? localStorage.getItem('speed-tiptap-token') : 'speed-test-token'; // 未开启jwt 则使用一个模拟值
        return "//localhost:3005/attachment/onlyoffice/preview/" + fileId + `?token=${token}`;
      },
    },
  })
  .mount("#app");
