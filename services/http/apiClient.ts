import { useRuntimeConfig } from "#app";
import { useAccountStore } from "@/stores/client/users/useAccountStore";

export const apiClient = () => {
  const config = useRuntimeConfig();
  const store = useAccountStore();

  const baseURL = config.public.apiBase;

  const makeAuthHeaders = () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (store.token) {
      headers.Authorization = `Bearer ${store.token}`;
    }
    return headers;
  };

  const request = <T>(url: string, options: any = {}) => {
    const headers = {
      ...makeAuthHeaders(),
      ...(options.headers || {}),
    };

    return $fetch<T>(url, {
      baseURL: baseURL,
      credentials: "include",
      ...options,
      headers,
    });
  };

  return {
    get: <T>(url: string, params?: any) => request<T>(url, { params }),
    post: <T>(url: string, body?: any) => request<T>(url, { method: "POST", body }),
    put: <T>(url: string, body?: any) => request<T>(url, { method: "PUT", body }),
    delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
    patch: <T>(url: string, body?: any) => request<T>(url, { method: "PATCH", body }),
    authGet: <T>(url: string, params?: any) => request<T>(url, { method: "GET", params }),
    authPost: <T>(url: string, body?: any) => request<T>(url, { method: "POST", body }),
    authPut: <T>(url: string, body?: any) => request<T>(url, { method: "PUT", body }),
    authPatch: <T>(url: string, body?: any) => request<T>(url, { method: "PATCH", body }),
    authDelete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
  };
};