# 附件上传配置（file）


### file 配置传入

```vue
<template>
  <SpeedTiptapEditor v-bind="simpleProps" />
</template>
<script lang="ts" setup>
import {
  fileDownload,
  fileUploadSingle,
  fileUploadMulti,
  fileDel,
} from "#example/api/attachement";

const simpleProps = {
  file: {
    uploadApis: {
      fileDownload: fileDownload,
      fileUploadSingle: fileUploadSingle,
      fileUploadMulti: fileUploadMulti,
      fileDel: fileDel,
      // 主要用于图片预览
      getPreviewUrl: (fileId: string) => {
        // 实际情况替换为实际地址(此处为本地启动的node附件服务)
        const globalStore = useGlobalStore();
        const token = globalStore.openJwt
          ? localStorage.getItem("speed-tiptap-token")
          : "speed-test-token"; // 未开启jwt 则使用一个模拟值
        return (
          "//localhost:3005/attachment/preview/" + fileId + `?token=${token}`
        );
      },
      // 主要用于文件预览
      getFilePreviewUrl: (fileId: string) => {
        // 实际情况替换为实际地址(此处为本地启动的node附件服务)
        const globalStore = useGlobalStore();
        const token = globalStore.openJwt
          ? localStorage.getItem("speed-tiptap-token")
          : "speed-test-token"; // 未开启jwt 则使用一个模拟值
        return (
          "//localhost:3005/onlyoffice/filePreview/" +
          fileId +
          `?token=${token}`
        );
      },
    },
  },
};
</script>
```


### 配置说明请参考：[图片上传](/config/image/)