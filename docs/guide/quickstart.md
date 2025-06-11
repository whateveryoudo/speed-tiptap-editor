# 快速开始

本节将介绍如何在项目中使用 Speed Components。

## 安装

使用 npm 、 pnpm 或 yarn 安装：

```bash
# npm
npm install speed-components-ui

# pnpm

pnpm add speed-components-ui

# yarn
yarn add speed-components-ui
```

## 在 main.ts 中引入组件库：

::: warning 初始化全局配置（app.use的第二个参数）
**iconfontUrl** - iconfont在线地址，实际使用替换为自己的;没有外网本地如何加载?<br>
**transformRequestRes** - 通用请求转换方法（此函数会影响调用请求的所有组件，请主要修改外层的通用结构`'ResponseType'`）
**registerGlobal** - 是否注册为全局组件，默认为true(如果按需，需设置为false)<br>
**apis** - 请求方法配置，部分组件会携带一些请求（常为api中导出的请求方法，可参照[speed-apis](https://github.com/whateveryoudo/speed-apis)）
 - fileUploadSingle 上传附件(单)通用方法,默认key为`file`
 - fileUploadMulti 上传附件(多)通用方法,默认key为`files[]`
 - fileDel 删除附件通用方法
 - fileDownload 下载附件通用方法
:::

### ResponseType

``` ts
// 统一配置请求返回数据类型
export type ResponseType<T = any> = {
  errCode: number;
  errMessage: string;
  success: boolean;
  data: T;
  [key: string]: any;
};
```


```ts
import { createApp } from "vue";
import SpeedComponents from "speed-components/components";
import "speed-components/dist/style.css";
import App from "./App.vue";
// 范例请求，需替换为实际请求
import { fileUploadSingle, fileUploadMulti, fileDel, fileDownload } from "@/api/file";

const app = createApp(App);
const globalConfig = {
  iconfontUrl: "//at.alicdn.com/t/c/font_3871804_pab634p3if.js", // 替换为你的iconfont地址
  registerGlobal: true,
  apis: {
    /***** 函数定义请参考 组件/hooks下 useCustomUpload *******/
    fileUploadSingle: fileUploadSingle,
    fileUploadMulti: fileUploadMulti,
    fileDel: fileDel,
    fileDownload: fileDownload,
  },
};
app.use(SpeedComponents, globalConfig);
app.mount("#app");
```

## 按需引入(需手动关闭registerGlobal)

使用 Vite 的项目，推荐使用 `unplugin-vue-components` 进行按需引入：

1. 安装插件：

```bash
npm install unplugin-vue-components -D
```

2. 在 vite.config.ts 中配置：

```ts
import { defineConfig } from "vite";
import Components from "unplugin-vue-components/vite";
import { SpeedComponentsResolver } from "speed-components/resolver";

export default defineConfig({
  plugins: [
    Components({
      resolvers: [SpeedComponentsResolver()],
    }),
  ],
});
```

3. 在组件中直接使用：

```vue
<template>
  <s-full-modal v-model:open="open">弹出弹框</s-button>
</template>
```

## 注意事项

1. 按需引入时，不需要手动引入样式
2. 完整引入时，需要手动引入样式文件
3. 建议使用 TypeScript 以获得更好的开发体验
