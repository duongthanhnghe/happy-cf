import { ref, computed } from "vue";
import { usersAPI } from "@/services/v1/admin/users.service";
import type { User } from '@/server/types/dto/v1/user.dto';

export const useAdminUserDetail = () => {
  const detailUser = ref<User|null>(null);

  const fetchDetailUser = async (id: string) => {
    try {
      const data = await usersAPI.getDetailAccount(id)
      if(data.code === 0) detailUser.value = data.data;
    } catch (err) {
      console.error('Error user detail', err)
    }
  }

  const getDetailUserApi = computed(() => detailUser.value);

  return {
    fetchDetailUser,
    getDetailUserApi
  }
}