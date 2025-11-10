import { ROUTES } from "@/shared/constants/routes";
import { useAccountStore } from "@/stores/admin/account/useAccountStore";

export default defineNuxtRouteMiddleware(async () => {
  const storeAccount = useAccountStore()

  if (storeAccount.getDetailAccount?.id) return

  const ok = await storeAccount.verifyToken()

  if (ok === false) {
    const adminToken = useCookie("admin_token")
    adminToken.value = null
    return navigateTo(ROUTES.ADMIN.LOGIN.path, { replace: true });
  }

  if (ok === true) return

  return

});