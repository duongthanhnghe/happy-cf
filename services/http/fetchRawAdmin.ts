import { useRuntimeConfig } from "#app"
import { useAccountAdminStore } from "@/stores/admin/account/useAccountAdminStore";

export const fetchRawAdmin = async (
  path: string,
  options: RequestInit = {}
) => {
  const config = useRuntimeConfig()
  const store = useAccountAdminStore()

  const headers: HeadersInit = {
    ...(options.headers || {}),
  }

  if (store.token) {
    headers.Authorization = `Bearer ${store.token}`
  }

  return fetch(`${config.public.apiAdminBase}${path}`, {
    ...options,
    headers,
    credentials: "include",
  })
}
