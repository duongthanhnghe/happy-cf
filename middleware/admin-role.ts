import { ref } from "vue";
import { useAccountStore } from '@/stores/users/useAccountStore'
import type { MyJwtPayload } from '@/server/types/dto/user.dto'
import { jwtDecode } from 'jwt-decode'
import { ROUTES } from '@/shared/constants/routes';

export default defineNuxtRouteMiddleware(async () => {
  const storeAccount = useAccountStore()
  const numberRoleAdmin = 2
  const isAdminRole = ref(false)

  const token = useCookie<string | null>('token')

  if (!token.value) {
    return navigateTo(ROUTES.PUBLIC.LOGIN.path, { replace: true })
  }

  try {
    const decoded = jwtDecode<MyJwtPayload>(token.value)

    if (!storeAccount.getDetailValue?.id) {
      await storeAccount.handleGetDetailAccount(decoded.id)
    }

    if (storeAccount.getDetailValue?.role !== numberRoleAdmin) {
      isAdminRole.value = false
      return navigateTo(ROUTES.PUBLIC.HOME.path, { replace: true })
    }

    isAdminRole.value = true
  } catch (err) {
    console.error('Token decode error:', err)
    return navigateTo(ROUTES.PUBLIC.LOGIN.path, { replace: true })
  }
})
