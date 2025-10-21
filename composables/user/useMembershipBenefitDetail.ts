import { ref, computed } from "vue";
import { usersAPI } from "@/services/v1/admin/users.service";
import type { MembershipBenefitDTO } from '@/server/types/dto/v1/user.dto'

export const useMembershipBenefitDetail = () => {
 
  const detailData = ref<MembershipBenefitDTO>();

  const fetchMembershipBenefitDetail = async (id: string) => {
    try {
      const data = await usersAPI.getMembershipBenefitById(id)
      if(data.code === 0){
        detailData.value = data.data;
      }
    } catch (err) {
      console.error('Error membership benefit', err)
    }
  }

  const getMembershipBenefitDetail = computed(() => detailData.value);

  return {
    fetchMembershipBenefitDetail,
    getMembershipBenefitDetail,
  }
}