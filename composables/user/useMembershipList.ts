import { ref, computed } from "vue";
import { usersAPI } from "@/services/users.service";
import type { MembershipLevels } from '@/server/types/dto/user.dto'

export const useMembershipList = () => {
 
  const listMembership = ref<{ data: MembershipLevels[] } | null>(null);

  const fetchMembershipList = async () => {
    try {
      const data = await usersAPI.getAllMembershipLevel()
      listMembership.value = data;
    } catch (err) {
      console.error('Error membership', err)
    }
  }

  const getMembershipList = computed(() => listMembership.value?.data);

  return {
    listMembership,
    fetchMembershipList,
    getMembershipList
  }
}