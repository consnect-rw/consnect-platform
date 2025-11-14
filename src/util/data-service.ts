
import { IServiceResponse } from "@/types/data-service/response";
import axios from "axios";

export class DataService {
    static async fetch<T>(serverUrl:string,endpoint:string):Promise<IServiceResponse<T | null>> {
        try {
            const res = await axios.get<IServiceResponse<T>>(`${serverUrl}/api/${endpoint}`);
            return res.data;
        } catch (error) {
            return this.handleAxiosError(error);
        }
    }

    static async post<TRequest, TResponse>(serverUrl:string,endpoint: string, data: TRequest): Promise<IServiceResponse<TResponse | null>> {
        try {
            const res = await axios.post<IServiceResponse<TResponse>>(`${serverUrl}/api/${endpoint}`, data);
            return res.data;
        } catch (error) {
            return this.handleAxiosError(error);
        }
    }

    static async put <TRequest, TResponse>(serverUrl:string,endpoint: string, data: TRequest): Promise<IServiceResponse<TResponse | null>> {
        try {
            const res = await axios.put<IServiceResponse<TResponse>>(`${serverUrl}/api/${endpoint}`, data);
            return res.data;
        } catch (error) {
            return this.handleAxiosError(error);
        }
    }

    static async delete<TResponse>(serverUrl: string,endpoint: string, data?: FormData): Promise<IServiceResponse<TResponse | null>> {
        try {
            const res = await axios.delete<IServiceResponse<TResponse>>(`${serverUrl}/api/${endpoint}`, {
            data,
            headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
        });
            return res.data;
        } catch (error) {
            return this.handleAxiosError(error);
            
        }
    }

    static handleAxiosError(error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log("Axios Error:", error.response?.data || error.message);
            return error.response?.data
        } else {
            console.log("Unexpected Error:", error);
            return null;
        }
    }
}
