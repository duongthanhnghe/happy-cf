import { useAccountStore } from "@/stores/client/users/useAccountStore";

export default defineNuxtRouteMiddleware(async () => {
  const storeAccount = useAccountStore()
  const token = useCookie("token")

  if (!token.value) return

  if (storeAccount.getUserId) return

  await storeAccount.verifyToken(true)

  return
});