import { ROUTES } from "@/shared/constants/routes";
import { useAccountStore } from "@/stores/admin/account/useAccountStore";

export default defineNuxtRouteMiddleware(async () => {
  const storeAccount = useAccountStore();

  if (storeAccount.getDetailAccount?.id) {
    return;
  }

  setTimeout(async function(){
    const ok = await storeAccount.verifyToken();
    if (!ok) {
      const adminToken = useCookie("admin_token");
      adminToken.value = null;
      return navigateTo(ROUTES.ADMIN.LOGIN.path, { replace: true });
    }
  }, 1000);
});