import axios from "axios";
import type { AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach bearer token from localStorage (if present) to every request
api.interceptors.request.use((config: AxiosRequestConfig | any) => {
  if (typeof window !== "undefined") {
    const tokenFromKeys =
      localStorage.getItem("token") || localStorage.getItem("accessToken");

    let token = tokenFromKeys;

    if (!token) {
      const userData = localStorage.getItem("userData");
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          token = parsed?.token || parsed?.accessToken || token;
        } catch (e) {
          // ignore parse errors
        }
      }
    }

    if (token) {
      // Ensure headers is an object and preserve any existing headers
      const existing = config.headers as Record<string, string> | undefined;
      config.headers = {
        ...(existing ?? {}),
        Authorization: `Bearer ${token}`,
      } as any;
    }
  }

  return config;
});

export default api;
