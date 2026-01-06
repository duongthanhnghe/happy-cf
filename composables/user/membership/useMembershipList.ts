import { ref, computed } from "vue";
import { usersAPI } from "@/services/v1/users.service";
import type { MembershipLevels } from '@/server/types/dto/v1/user.dto'

export const useMembershipList = () => {
 
  const listMembership = ref<MembershipLevels[]>([]);
  const loading = ref(false)

  const fetchMembershipList = async () => {
    loading.value = true
    try {
      const data = await usersAPI.getAllMembershipLevel()
      if(data.code === 0){
        listMembership.value = data.data;
      }
    } catch (err) {
      console.error('Error membership', err)
    } finally {
      loading.value = false
    }
  }

  const getMembershipList = computed(() => listMembership.value);

  return {
    loading,
    fetchMembershipList,
    getMembershipList
  }
}