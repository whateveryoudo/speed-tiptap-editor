import request from "../request";
import { userPrefix } from "../path";
// Speed Tiptap 登录，获取 token（示例）
export const speedTiptapLogin = (payload: {
  username: string;
  password: string;
}) => {
  return request.post(`${userPrefix}/login`, payload);
};
