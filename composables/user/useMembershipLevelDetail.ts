import { ref, computed } from "vue";
import { usersAPI } from "@/services/v1/users.service";
import type { MembershipLevels } from '@/server/types/dto/v1/user.dto'

export const useMembershipLevelDetail = () => {
 
  const detailData = ref<MembershipLevels>();

  const fetchMembershipLevelDetail = async (id: string) => {
    try {
      const data = await usersAPI.getMembershipLevelById(id)
      if(data.code === 0){
        detailData.value = data.data;
      }
    } catch (err) {
      console.error('Error membership', err)
    }
  }

  const getMembershipLevelDetail = computed(() => detailData.value);

  return {
    fetchMembershipLevelDetail,
    getMembershipLevelDetail,
  }
}