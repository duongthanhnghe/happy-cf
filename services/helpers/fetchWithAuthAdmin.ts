import { useAccountStore } from "@/stores/admin/account/useAccountStore";

export async function fetchWithAuthAdmin(url: string, options: any = {}) {
  const store = useAccountStore();

  let token = store.token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const isRetry = options.__isRetry === true;

  const makeRequest = async () => {
    return fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });
  };

  let res = await makeRequest();

  if (res.status !== 401) {
    return res;
  }

  if (isRetry) {
    await store.handleLogout?.();
    return res;
  }

  const refreshed = await store.refreshToken();
  if (!refreshed) {
    await store.handleLogout?.();
    return res;
  }

  token = store.token;

  headers.Authorization = `Bearer ${token}`;

  options.__isRetry = true;

  // Retry lại request
  return makeRequest();
}
