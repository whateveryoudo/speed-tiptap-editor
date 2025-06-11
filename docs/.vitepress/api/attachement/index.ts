import request from "../request";
import { attachmentPrefix } from "../path";
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