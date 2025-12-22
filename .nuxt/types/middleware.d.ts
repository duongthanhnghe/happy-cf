import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = "admin-role" | "auth-login" | "category-news-detail" | "category-product-detail" | "news-main" | "post-detail" | "product-detail" | "product-search-result"
declare module 'nuxt/app' {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}