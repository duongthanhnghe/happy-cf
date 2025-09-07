import { ref, computed } from "vue";
import { usersAPI } from "@/services/users.service";
import type { User } from '@/server/types/dto/user.dto';

export const useUserDetail = () => {
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
    detailUser,
    fetchDetailUser,
    getDetailUserApi
  }
}