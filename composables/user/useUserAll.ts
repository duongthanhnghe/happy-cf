import { ref, computed } from "vue";
import { usersAPI } from "@/services/v1/users.service";
import type { UserPaginationDTO } from '@/server/types/dto/v1/user.dto';

export const useUserAll = () => {
  const listUserAll = ref<UserPaginationDTO>();

  const fetchListUserAll = async (page: number, limit: number, role: number) => {
    try {
      const data = await usersAPI.getAllUsers(page,limit,role)
      if(data.code === 0) listUserAll.value = data
    } catch (err) {
      console.error('Error product all', err)
    }
  }

  const getListUserAllApi = computed(() => listUserAll.value);

  return {
    listUserAll,
    fetchListUserAll,
    getListUserAllApi
  }
}