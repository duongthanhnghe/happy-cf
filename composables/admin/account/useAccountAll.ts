import { ref, computed } from "vue";
import { accountAPI } from "@/services/v1/admin/account.service";
import { useForbiddenHandler } from "@/utils/handle403";
import type { AccountPaginationDTO } from '@/server/types/dto/v1/account.dto'
export const useAccountAll = () => {
  const listAccountAll = ref<AccountPaginationDTO>();
  const { handleForbiddenAccess } = useForbiddenHandler();

  const fetchListAccountAll = async (page: number, limit: number) => {
    try {
      const data = await accountAPI.getAccountList(page,limit)
      
      if (data.code === 403) {
        handleForbiddenAccess(data.message);
        return;
      }

      if(data.code === 0) listAccountAll.value = data
    } catch (err) {
      console.error('Error account all', err)
    }
  }

  const getListAccountAllApi = computed(() => listAccountAll.value);

  return {
    fetchListAccountAll,
    getListAccountAllApi
  }
}