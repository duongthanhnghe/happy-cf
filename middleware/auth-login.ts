import { useAccountStore } from '@/stores/users/useAccountStore'
import { ROUTES } from '@/shared/constants/routes';

export default defineNuxtRouteMiddleware(() => {
  const storeAccount = useAccountStore()
  const token = useCookie<string | null>('token')

  const isAuthenticated = !!(storeAccount.getDetailValue?.id || token.value)

  if (!isAuthenticated) {
    return navigateTo(ROUTES.PUBLIC.LOGIN.path, { replace: true })
  }
})
