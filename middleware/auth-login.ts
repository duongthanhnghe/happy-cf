import { useAccountStore } from '@/stores/client/users/useAccountStore'
import { ROUTES } from '@/shared/constants/routes';

export default defineNuxtRouteMiddleware(async () => {
  const storeAccount = useAccountStore()
  const token = useCookie("token")

  if (!token.value) {
    return navigateTo(ROUTES.PUBLIC.LOGIN.path, { replace: true })
  }

  if (storeAccount.getUserId) return

  const res = await storeAccount.verifyToken(true)

  if (res === false) {
    return navigateTo(ROUTES.PUBLIC.LOGIN.path, { replace: true })
  }
})