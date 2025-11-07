import { useAccountStore } from '@/stores/client/users/useAccountStore'
import { ROUTES } from '@/shared/constants/routes';

export default defineNuxtRouteMiddleware(async() => {
  const storeAccount = useAccountStore()

  if (storeAccount.getDetailValue?.id) return

  const ok = await storeAccount.verifyToken()

  if (ok === false) {
    const token = useCookie("token")
    token.value = null
    return navigateTo(ROUTES.PUBLIC.LOGIN.path, { replace: true })
  }

  if (ok === true) return

  return
})

