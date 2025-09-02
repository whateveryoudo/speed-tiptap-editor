import request from "../request";
import { attachmentPrefix, onlyofficePrefix } from "../path";
export const fileDownload = (fileId: string) => {
  return request.get(`${attachmentPrefix}/download/${fileId}`, {
    responseType: "blob",
    headers: {
      fullRes: true,
    },
  });
};

export const fileUploadSingle = (formData: FormData) => {
  return request.post(`${attachmentPrefix}/upload/single`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
export const fileUploadMulti = (formData: FormData) => {
  return request.post(`${attachmentPrefix}/upload/multi`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const fileDel = (fileId: string) => {
  return request.delete(`${attachmentPrefix}/delete/${fileId}`);
};


// 获取 OnlyOffice 文档配置（后端已对 config 使用 ONLYOFFICE_SECRET 签名）
export const getOnlyofficeConfig = (payload: { fileId: string; mode?: 'view' | 'edit' }) => {
  return request.post(`${onlyofficePrefix}/config`, payload);
};