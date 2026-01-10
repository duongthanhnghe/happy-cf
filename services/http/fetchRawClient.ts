import { useRuntimeConfig } from "#app"
import { useAccountStore } from "@/stores/client/users/useAccountStore";

export const fetchRawClient = async (
  path: string,
  options: RequestInit = {}
) => {
  const config = useRuntimeConfig()
  const store = useAccountStore()

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
