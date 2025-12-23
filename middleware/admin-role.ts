// import { ROUTES } from "@/shared/constants/routes";
// import { useAccountStore } from "@/stores/admin/account/useAccountStore";

// export default defineNuxtRouteMiddleware(async () => {
//   const storeAccount = useAccountStore()

//   if (storeAccount.getDetailAccount?.id) return

//   const ok = await storeAccount.verifyToken()

//   if (ok === false) {
//     const adminToken = useCookie("admin_token")
//     adminToken.value = null
//     return navigateTo(ROUTES.ADMIN.LOGIN.path, { replace: true });
//   }

//   if (ok === true) return

//   return

// });

import { useAccountStore } from "@/stores/admin/account/useAccountStore";
import { ROUTES } from '@/shared/constants/routes'
import type { RouteLocationNormalized } from 'vue-router'

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const storeAccount = useAccountStore()

  if (process.client) {
    await storeAccount.$hydrate?.()
  }

  if (!storeAccount.token) {
    const res = await storeAccount.refreshToken()
    if (!res && process.client && to.path.startsWith(`${ROUTES.ADMIN.ACCOUNT.path}`)) {
      return navigateTo(ROUTES.ADMIN.LOGIN.path, { replace: true })
    }
  }

  if (!storeAccount.getUserId) {
    const verified = await storeAccount.verifyToken(true)
    if (!verified && process.client && to.path.startsWith(`${ROUTES.ADMIN.ACCOUNT.path}`)) {
      return navigateTo(ROUTES.ADMIN.LOGIN.path, { replace: true })
    }
  }
})
