import { ref, computed } from "vue";
import { usersAPI } from "@/services/users.service";
import type { User } from '@/server/types/dto/user.dto';

export const useUserAll = () => {
  const listUserAll = ref<User[]|null>(null);

  const fetchListUserAll = async () => {
    try {
      const data = await usersAPI.getAllUsers()
      if(data.code === 0) listUserAll.value = data.data
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