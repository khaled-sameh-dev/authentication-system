import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { ENV } from "./env.config";
import { authStore } from "@/store/auth.store";
import type { RefreshTokenResponse } from "@/types/auth.types";

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});


apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authStore.getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);


let isRefreshing = false;

interface FailedRequestPromise {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let failedQueue: FailedRequestPromise[] = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh-token");

    if (isAuthEndpoint || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;


    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return apiClient(originalRequest);
        })
        .catch((queueError) => Promise.reject(queueError));
    }

    isRefreshing = true;

    try {
      const { data: response } = await apiClient.post<RefreshTokenResponse>(
        "/auth/refresh-token",
      );
      const { accessToken } = response.data;

      authStore.setSession(accessToken);
      processQueue(null, accessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      authStore.clearSession();

      if (window.location.pathname !== "/login") {
        window.location.href = "/login?expired=true";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
