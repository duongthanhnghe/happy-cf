import { ref, computed } from "vue";
import { usersAPI } from "@/services/users.service";
import type { MembershipLevels } from '@/server/types/dto/user.dto'

export const useMembershipList = () => {
 
  const listMembership = ref<MembershipLevels[]>([]);

  const fetchMembershipList = async () => {
    try {
      const data = await usersAPI.getAllMembershipLevel()
      if(data.code === 0){
        listMembership.value = data.data;
      }
    } catch (err) {
      console.error('Error membership', err)
    }
  }

  const getMembershipList = computed(() => listMembership.value);

  return {
    fetchMembershipList,
    getMembershipList
  }
}