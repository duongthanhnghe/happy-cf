export type MiddlewareKey = "admin-role" | "auth-login" | "category-news-detail" | "category-product-detail" | "news-main" | "post-detail"
declare module 'nitropack' {
  interface NitroRouteConfig {
    appMiddleware?: MiddlewareKey | MiddlewareKey[] | Record<MiddlewareKey, boolean>
  }
}