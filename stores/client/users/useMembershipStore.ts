import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useMembershipList } from "@/composables/user/membership/useMembershipList";
import type { MembershipLevels } from '@/server/types/dto/v1/user.dto'

export const useMembershipStore = defineStore("MembershipStore", () => {
  const { loading, getMembershipList, fetchMembershipList } = useMembershipList();

  const dataList = ref<MembershipLevels[]>([])

  const fetchMembershipStore = async () => {
    if (dataList.value.length > 0 ) return

    await fetchMembershipList()
    dataList.value = getMembershipList.value
  }

  const getListData = computed(() => dataList.value);
  
  return {
    dataList,
    fetchMembershipStore,
    getListData,
    loading,
  };
})
