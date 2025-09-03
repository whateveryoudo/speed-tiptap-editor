/*
 * @Author: Anxure
 * @Github: https://github.com/Anxure
 * @Desc:
 * @Date: 2022-05-30 15:42:04
 * @LastEditors: Bwrong
 * @LastEditTime: 2024-05-10 14:28:52
 */
import axios, { AxiosError } from "axios";
import { message } from "ant-design-vue";
import { useGlobalStore } from '#example/store/index';
// 统一配置请求返回数据类型
export type ResponseType<T = any> = {
  errCode: number;
  errMessage: string;
  success: boolean;
  data: T;
  [key: string]: any;
};
export const HTTP_CODE = {
  400: "请求参数错误",
  401: "未授权, 请重新登录",
  403: "服务器拒绝本次访问",
  404: "请求地址错误",
  500: "服务器开小差啦，请稍候再试",
  501: "服务器不支持该请求中使用的方法",
  502: "网络错误",
};
console.log(import.meta.env);
const request = axios.create({
  timeout: 100000,
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});
request.interceptors.request.use(
  (config: any) => {
    // 登录接口不注入 Authorization，避免首个获取 token 的请求携带旧/测试 token
    const url = config.url || ''
    if (url.includes('/onlyoffice/login')) {
      return config
    }
    const globalStore = useGlobalStore();
   
    // 其他请求优先使用路由守卫写入的 token；无则回退到测试 token
    const token = globalStore.openJwt ? localStorage.getItem('speed-tiptap-token') : 'speed-test-token'; // 未开启jwt 则使用一个模拟值
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);
request.interceptors.response.use(
  (response) => {
    const {
      data,
      config: { responseType },
      headers,
    } = response;
    // 返回全量res
    if (response?.config?.headers?.fullRes) {
      return response;
    }
    if (data.success) {
      return data;
    } else {
      if (responseType === "blob") {
        // 这里交给工具函数处理
        // const reg = new RegExp("(?<=filename=).+", "g"); // 兼容safari 不支持断言验证
        // const fileName = headers?.["content-disposition"]?.match(reg) || "";
        // data.fileName = fileName + "";
        return data;
      }
      message.destroy();
      message.error(data.errMessage || "服务器开小差啦，请稍后再试");
      return Promise.reject(data.errMessage);
    }
  },
  (error: AxiosError) => {
    console.log(error);
    if ((error.config as any).notShowErrorMessage) return;
    if (error.response) {
      message.destroy();
      message.error(
        (error.response.data as any)?.message! ||
          HTTP_CODE[error.response.status as keyof typeof HTTP_CODE] ||
          "服务器开小差啦，请稍后再试"
      );
      return Promise.reject(error);
    } else {
      message.destroy();
      message.error("请求超时, 请刷新重试");
      return Promise.reject(new Error("请求超时, 请刷新重试"));
    }
  }
);

export default request;
