import type { ComputedRef, MaybeRef } from 'vue'
export type LayoutKey = "admin-auth-layout" | "admin-layout" | "auth-layout" | "cart-layout" | "default" | "user-layout"
declare module 'nuxt/app' {
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false>
  }
}