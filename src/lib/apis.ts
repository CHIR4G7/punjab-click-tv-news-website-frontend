import axios, { AxiosError, AxiosResponse } from "axios";

// const SERVER_BASE_URL = "http://localhost:3000";
const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

const apiClient = axios.create({
  baseURL: SERVER_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    console.log(
      `Making a ${config.method?.toUpperCase()} request to : ${config?.url}`
    );
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response:AxiosResponse) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message:
        (error.response?.data as any)?.message ||
        error.message ||
        "Something went wrong",
      status: error.response?.status,
      code: error.code,
    };
    return Promise.reject(apiError);
  }
);

// A function to call the apiCall
export const makeApiRequest = async <T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any
): Promise<ApiResponse<T>> => {
  try {

    const response: AxiosResponse<T> = await apiClient({
      url,
      method,
      data,
    });
    return {
      data: response.data,
      status: response.status,
      message: "Request Successful!",
    };
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      throw {
        message: error.message,
        status: (error as any).status || 500,
      } as ApiError;
    }
    throw {
      message: error.message,
      status: 500,
    } as ApiError;
  }
};
