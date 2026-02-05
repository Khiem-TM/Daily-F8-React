import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

// instance axios với default config
export const axiosInstance = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : "https://instagram.f8team.dev/api",
  withCredentials: false, // Disable credentials to avoid CORS issues with wildcard origin
});

let isRefreshing = false;
let failedQueue: any[] = [];

// Xử lý hàng đợi các request khi token đang được refresh
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use((config) => {
  // Lấy accessToken từ zustand store
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;

      try {
        const res = await axiosInstance.post("/auth/refresh-token", {
          refreshToken,
        });
        const { accessToken, refreshToken: newRefreshToken } = res.data.data;

        // Cập nhật lại token trong zustand store
        useAuthStore.getState().setAuth({
          user: useAuthStore.getState().user!,
          accessToken,
          refreshToken: newRefreshToken,
        });

        axiosInstance.defaults.headers.common["Authorization"] =
          "Bearer " + accessToken;
        originalRequest.headers["Authorization"] = "Bearer " + accessToken;
        processQueue(null, accessToken);
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        useAuthStore.getState().logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
