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

const request = axios.create({
  timeout: 100000,
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});
request.interceptors.request.use(
  (config: any) => {
    // 添加测试token
    config.headers["Authorization"] = `Bearer speed-test-token`;
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
        const reg = new RegExp("(?<=filename=).+", "g"); // 兼容safari 不支持断言验证
        const fileName = headers?.["content-disposition"]?.match(reg) || "";
        data.fileName = fileName + "";
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
        (error.response.data as any)?.errMessage! ||
          HTTP_CODE[error.response.status as keyof typeof HTTP_CODE] ||
          "服务器开小差啦，请稍后再试"
      );
      if (error.response.status === 401) {
        message.error("请先登录");
      }
      return Promise.reject(error);
    } else {
      message.destroy();
      message.error("请求超时, 请刷新重试");
      return Promise.reject(new Error("请求超时, 请刷新重试"));
    }
  }
);

export default request;
