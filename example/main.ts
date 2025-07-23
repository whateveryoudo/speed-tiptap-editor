import { createApp } from "vue";
import App from "./App.vue";
import router from "./src/router";
import SpeedTiptapEditor from "../src/main";
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
  .use(
    SpeedTiptapEditor, {
      apis: {
        fileDownload: fileDownload,
        fileUploadSingle: fileUploadSingle,
        fileUploadMulti: fileUploadMulti,
        fileDel: fileDel,
        getPreviewUrl: (fileId: string) => {
          // 实际情况替换为实际地址
          return (
            "//localhost:3005/attachment/preview/" +
            fileId +
            "?token=speed-test-token"
          );
        },
      },
    }
  )
  .mount("#app");
