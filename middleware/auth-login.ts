import {
  useAccountStore
} from '@/stores/users/useAccountStore'

export default defineNuxtRouteMiddleware(() => {
  const storeAccount = useAccountStore();
  
  const isAuthenticated = storeAccount.getDetailValue?.id || process.client && localStorage.getItem('token')
  
  if (!isAuthenticated && process.client) {
    return navigateTo('/login', { replace: true })
  }
})