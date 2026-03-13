/**
 * Axios HTTP Client with Auth Interceptors
 *
 * This file sets up an Axios instance pre-configured for the QuantexQ API.
 * Interceptors are implemented but COMMENTED OUT — uncomment when the real
 * backend is ready.
 *
 * Request Interceptor  → injects Authorization: Bearer <token> header
 * Response Interceptor → handles 401 token refresh and logout on failure
 */

// import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from "axios";

// ─── Constants ───────────────────────────────────────────────────────────────

// const AUTH_TOKEN_KEY = "quantexq_access_token";
// const REFRESH_TOKEN_KEY = "quantexq_refresh_token";

// ─── Token Helpers ────────────────────────────────────────────────────────────

// export const tokenStorage = {
//   getAccessToken: () => localStorage.getItem(AUTH_TOKEN_KEY),
//   setAccessToken: (token: string) => localStorage.setItem(AUTH_TOKEN_KEY, token),
//   removeAccessToken: () => localStorage.removeItem(AUTH_TOKEN_KEY),
//
//   getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
//   setRefreshToken: (token: string) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
//   removeRefreshToken: () => localStorage.removeItem(REFRESH_TOKEN_KEY),
//
//   clearAll: () => {
//     localStorage.removeItem(AUTH_TOKEN_KEY);
//     localStorage.removeItem(REFRESH_TOKEN_KEY);
//   },
// };

// ─── Axios Instance ───────────────────────────────────────────────────────────

// const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// export const apiClient: AxiosInstance = axios.create({
//   baseURL: BASE_URL,
//   timeout: 15_000,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Attaches the Bearer token to every outgoing request.

// apiClient.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token = tokenStorage.getAccessToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   }
// );

// ─── Response Interceptor ─────────────────────────────────────────────────────
// On 401 → attempt silent token refresh; on failure → clear session & redirect.

// let isRefreshing = false;
// let failedRequestQueue: Array<{
//   resolve: (token: string) => void;
//   reject: (error: unknown) => void;
// }> = [];

// const processQueue = (error: unknown, token: string | null = null) => {
//   failedRequestQueue.forEach((promise) => {
//     if (error) {
//       promise.reject(error);
//     } else {
//       promise.resolve(token!);
//     }
//   });
//   failedRequestQueue = [];
// };

// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & {
//       _retry?: boolean;
//     };
//
//     // 401 Unauthorized — attempt silent token refresh
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         // Queue the request until the ongoing refresh completes
//         return new Promise((resolve, reject) => {
//           failedRequestQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             return apiClient(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }
//
//       originalRequest._retry = true;
//       isRefreshing = true;
//
//       const refreshToken = tokenStorage.getRefreshToken();
//       if (!refreshToken) {
//         tokenStorage.clearAll();
//         window.location.href = "/sign-in";
//         return Promise.reject(error);
//       }
//
//       try {
//         const response = await axios.post<{ data: { accessToken: string } }>(
//           `${BASE_URL}/auth/refresh`,
//           { refreshToken }
//         );
//         const newAccessToken = response.data.data.accessToken;
//
//         tokenStorage.setAccessToken(newAccessToken);
//         processQueue(null, newAccessToken);
//
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         processQueue(refreshError, null);
//         tokenStorage.clearAll();
//         window.location.href = "/sign-in";
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }
//
//     // 403 Forbidden — user lacks permission
//     // if (error.response?.status === 403) {
//     //   window.location.href = "/unauthorized";
//     // }
//
//     return Promise.reject(error);
//   }
// );

// export default apiClient;
