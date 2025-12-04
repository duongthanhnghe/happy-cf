import { useAccountStore } from '@/stores/client/users/useAccountStore'
import { ROUTES } from '@/shared/constants/routes'
import type { RouteLocationNormalized } from 'vue-router'

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const storeAccount = useAccountStore()

  if (process.client) {
    await storeAccount.$hydrate?.()
  }

  if (!storeAccount.token) {
    const res = await storeAccount.refreshToken()
    if (!res && process.client && to.path.startsWith(`${ROUTES.PUBLIC.ACCOUNT.path}`)) {
      return navigateTo(ROUTES.PUBLIC.LOGIN.path, { replace: true })
    }
  }

  if (!storeAccount.getUserId) {
    const verified = await storeAccount.verifyToken(true)
    if (!verified && process.client && to.path.startsWith(`${ROUTES.PUBLIC.ACCOUNT.path}`)) {
      return navigateTo(ROUTES.PUBLIC.LOGIN.path, { replace: true })
    }
  }
})
