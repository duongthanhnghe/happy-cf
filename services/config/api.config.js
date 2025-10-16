export const apiConfig = {
  baseApiURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1',
  adminApiURL: import.meta.env.VITE_API_ADMIN_URL || 'http://localhost:5001/api/v1/admin',
}
