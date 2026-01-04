/*
 * @Author: ykx
 * @Date: 2023-02-06 18:06:47
 * @LastEditTime: 2024-03-19 11:39:25
 * @LastEditors: Anxure
 * @Description:
 */
import type { App, Component } from "vue";
import { computed, ref } from "vue";
import SpeedTiptapEditor from "./editor.vue";
import SpeedComponents from "speed-components-ui/components";
import { type ResponseType} from "speed-components-ui";
import "speed-components-ui/dist/style.css";
import "./assets/style/index.less";
import baseConfig from "./config";
import SpeedTooltip from "./components/SpeedTooltip/index.vue";
// 导入 UnoCSS 样式
import 'uno.css'
// 组件列表
const components: Component[] = [SpeedTiptapEditor];

// AJAX 方法类型
type AjaxMethod = (params?: any) => Promise<any>;

// 全局配置类型
export interface GlobalConfig {
  apis?: {
    [key: string]: AjaxMethod;
  };
  registerGlobal?: boolean;
  iconfontUrl?: string;
  transformRequestRes?: (res: any) => ResponseType; // 请求返回数据转换
}

// 默认配置
const defaultConfig: GlobalConfig = {
  registerGlobal: true,
  iconfontUrl: "",
};

// 使用 ref 创建响应式配置
const configRef = ref<GlobalConfig>({ ...defaultConfig });

// 使用 computed 包装配置，确保响应式
const currentConfig = computed(() => configRef.value);

// 设置全局配置
export const setConfig = (config: Partial<GlobalConfig>) => {
  configRef.value = {
    ...configRef.value,
    ...config,
  };
};

const install = (app: App, config?: Partial<GlobalConfig>) => {
  // 合并配置
  if (config) {
    setConfig(config);
  }
  // 注册组件
  if (currentConfig.value.registerGlobal) {
    components.forEach((component) => {
      app.component(component.name as string, component as any);
    });
  }
  app.component(SpeedTooltip.name as string, SpeedTooltip);
  // 注入响应式配置
  app.provide("speedUseTiptapConfig", currentConfig);
  // 注册SpeedComponents（这里仅设置图标就行，这是editor自己的内置配置）
  app.use(SpeedComponents, {
    iconfontUrl: [
      baseConfig.iconfontUrl
      // currentConfig.value.iconfontUrl,
    ],
    // apis: currentConfig.value.apis,
    // transformRequestRes: currentConfig.value.transformRequestRes,
  });

};

export { default as SpeedTiptapEditor } from "./editor.vue";
export default {
  install,
  setConfig,
  version: "0.1.0",
};
