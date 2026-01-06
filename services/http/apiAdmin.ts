import { useRuntimeConfig } from "#app";
import { useAccountAdminStore } from "@/stores/admin/account/useAccountAdminStore";

export const apiAdmin = () => {
  const config = useRuntimeConfig();
  const store = useAccountAdminStore();

  const baseURL = config.public.apiAdminBase;

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
    // auth: <T>(url: string, options?: any) => request<T>(url, options),
  };
};
