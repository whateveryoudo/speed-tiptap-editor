export declare const fileDownload: (fileId: string) => Promise<import('axios').AxiosResponse<any, any>>;
export declare const fileUploadSingle: (formData: FormData) => Promise<import('axios').AxiosResponse<any, any>>;
export declare const fileUploadMulti: (formData: FormData) => Promise<import('axios').AxiosResponse<any, any>>;
export declare const fileDel: (fileId: string) => Promise<import('axios').AxiosResponse<any, any>>;
export declare const getOnlyofficeConfig: (payload: {
    fileId: string;
    mode?: "view" | "edit";
}) => Promise<import('axios').AxiosResponse<any, any>>;
