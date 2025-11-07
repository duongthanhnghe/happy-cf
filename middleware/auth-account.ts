import { useAccountStore } from "@/stores/client/users/useAccountStore";

export default defineNuxtRouteMiddleware(async () => {
  const storeAccount = useAccountStore()
  
    if (storeAccount.getDetailValue?.id) return
  
    const ok = await storeAccount.verifyToken()
  
    if (ok === false) {
      const token = useCookie("token")
      token.value = null
    }
  
    if (ok === true) return
  
    return
});