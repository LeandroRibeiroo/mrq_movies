import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Config from "react-native-config";
import { tokenStorage } from "./storage";
import { ApiError } from "../interfaces/api-error";

export const API_BASE_URL = Config.API_BASE_URL || "";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const apiError: ApiError = {
        message: (error.response.data as any)?.message || "An error occurred",
        statusCode: error.response.status,
        error: (error.response.data as any)?.error,
      };

      if (error.response.status === 401) {
        tokenStorage.removeToken();

        // In a real application, we will refresh the token here...
      }

      return Promise.reject(apiError);
    } else if (error.request) {
      const networkError: ApiError = {
        message: "Network error. Please check your connection.",
        statusCode: 0,
      };
      return Promise.reject(networkError);
    } else {
      const unknownError: ApiError = {
        message: "An unexpected error occurred.",
        statusCode: 0,
      };
      return Promise.reject(unknownError);
    }
  }
);

export default apiClient;
