import { ROUTES } from "@/shared/constants/routes";
import { useAdminAuthStore } from "@/stores/admin/admin-auth/useAdminAuthStore";

export default defineNuxtRouteMiddleware(async () => {
  const storeAdminAuth = useAdminAuthStore();

  if (storeAdminAuth.getDetailAccount?.id) {
    return;
  }

  setTimeout(async function(){
    const ok = await storeAdminAuth.verifyToken();
    if (!ok) {
      const adminToken = useCookie("admin_token");
      adminToken.value = null;
      return navigateTo(ROUTES.ADMIN.LOGIN.path, { replace: true });
    }
  }, 1000);
});