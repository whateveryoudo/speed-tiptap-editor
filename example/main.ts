import { createApp } from "vue";
import App from "./App.vue";
import router from "./src/router";
import SpeedTiptapEditor from "../src";
// import SpeedTiptapEditor from "../dist/speed-tiptap-editor-index.es.js";
// import "../dist/style.css";
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
console.log(SpeedTiptapEditor);
createApp(App)
  .use(router)
  .use(createPinia())
  .use(SpeedTiptapEditor, {
    // 定义编辑器的一些公共配置  
    // apis: {
    //   fileDownload: fileDownload,
    //   fileUploadSingle: fileUploadSingle,
    //   fileUploadMulti: fileUploadMulti,
    //   fileDel: fileDel,
    //   // 主要用于图片预览
    //   getPreviewUrl: (fileId: string) => {
    //      // 实际情况替换为实际地址(此处为本地启动的node附件服务)
    //      const globalStore = useGlobalStore();
    //      const token = globalStore.openJwt ? localStorage.getItem('speed-tiptap-token') : 'speed-test-token'; // 未开启jwt 则使用一个模拟值
    //      return "//localhost:3005/attachment/onlyoffice/preview/" + fileId + `?token=${token}`;
    //   },
    // },
  })
  .mount("#app");
