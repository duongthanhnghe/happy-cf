export type MiddlewareKey = "admin-role" | "auth-login" | "category-news-detail" | "post-news-detail"
declare module 'nitropack' {
  interface NitroRouteConfig {
    appMiddleware?: MiddlewareKey | MiddlewareKey[] | Record<MiddlewareKey, boolean>
  }
}