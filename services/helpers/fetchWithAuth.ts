import { useAccountStore } from "@/stores/client/users/useAccountStore";

export async function fetchWithAuth(url: string, options: any = {}) {
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

  // --- LẦN REQUEST ĐẦU ---
  let res = await makeRequest();

  // Nếu không phải 401 → trả kết quả luôn
  if (res.status !== 401) {
    return res;
  }

  // Nếu request đã retry trước đó → không retry nữa
  if (isRetry) {
    await store.handleLogout?.();
    return res;
  }

  // --- ĐẾN ĐÂY LÀ TOKEN HẾT HẠN ---
  console.warn("⚠ Token expired → Refreshing...");

  const refreshed = await store.refreshToken();
  if (!refreshed) {
    console.error("❌ Refresh token failed → Logout");
    await store.handleLogout?.();
    return res;
  }

  // Lấy token mới
  token = store.token;

  headers.Authorization = `Bearer ${token}`;

  // Gắn flag retry
  options.__isRetry = true;

  // Retry lại request
  return makeRequest();
}
