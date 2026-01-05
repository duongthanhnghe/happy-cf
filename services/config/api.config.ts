export const apiConfig = {
  baseApiURL:
    process.server
      ? process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080'
      : '/api',

  adminApiURL:
    process.server
      ? process.env.NUXT_PUBLIC_API_ADMIN_BASE || 'http://localhost:8080/admin'
      : '/api/admin',
}