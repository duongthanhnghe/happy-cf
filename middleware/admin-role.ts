import { ref } from "vue";
import {
  useAccountStore
} from '@/stores/users/useAccountStore'
import type { MyJwtPayload } from '@/server/types/dto/user.dto'
import { jwtDecode } from 'jwt-decode'

export default defineNuxtRouteMiddleware(async () => {
  const storeAccount = useAccountStore();
  const numberRoleAdmin = 2
  const isAdminRole = ref(false)

  if (process.client) {
    const token = ref<string | null>(localStorage.getItem('token'))

    if(token === null) return navigateTo('/login', { replace: true })

    const decoded = jwtDecode<MyJwtPayload>(token.value) 

    if(!storeAccount.getDetailValue?.id) await storeAccount.handleGetDetailAccount(decoded.id)

    if (storeAccount.getDetailValue?.role != numberRoleAdmin) isAdminRole.value = true
  }

  if(isAdminRole.value && process.client) return navigateTo('/', { replace: true })
})