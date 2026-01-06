import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useMembershipList } from '@/composables/admin/user/useAdminMembershipList';
import type { MembershipLevels } from '@/server/types/dto/v1/user.dto'

export const useMembershipStore = defineStore("MembershipStoreAdmin", () => {
  const { loading, getMembershipList, fetchMembershipList } = useMembershipList();

  const dataList = ref<MembershipLevels[]>([])

  const fetchMembershipStore = async () => {
    if (getMembershipList.value.length > 0) return

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