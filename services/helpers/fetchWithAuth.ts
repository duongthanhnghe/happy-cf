import { useAccountStore } from "@/stores/client/users/useAccountStore";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const store = useAccountStore();

  const token = store.token;

  const headers: any = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
}
