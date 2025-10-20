import { ref, computed } from "vue";
import { usersAPI } from "@/services/v1/admin/users.service";
import type { MembershipBenefitDTO } from '@/server/types/dto/v1/user.dto'

export const useMembershipBenefitList = () => {
 
  const listData = ref<MembershipBenefitDTO[]>([]);

  const fetchMembershipBenefitList = async () => {
    try {
      const data = await usersAPI.getAllMembershipBenefit()
      if(data.code === 0){
        listData.value = data.data;
      }
    } catch (err) {
      console.error('Error membership', err)
    }
  }

  const getMembershipBenefitList = computed(() => listData.value);

  return {
    fetchMembershipBenefitList,
    getMembershipBenefitList
  }
}