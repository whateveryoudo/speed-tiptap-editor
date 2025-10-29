export type ResponseType<T = any> = {
    errCode: number;
    errMessage: string;
    success: boolean;
    data: T;
    [key: string]: any;
};
export declare const HTTP_CODE: {
    400: string;
    401: string;
    403: string;
    404: string;
    500: string;
    501: string;
    502: string;
};
declare const request: import('axios').AxiosInstance;
export default request;
