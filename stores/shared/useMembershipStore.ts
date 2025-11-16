import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useMembershipList } from '@/composables/user/useMembershipList';
import type { MembershipLevels } from '@/server/types/dto/v1/user.dto'

const TTL_MS = 10 * 24 * 60 * 60 * 1000; // 10 days

const storeName =
  typeof window !== "undefined" &&
  window.location.pathname.startsWith("/admin")
    ? "MembershipStoreAdmin"
    : "MembershipStore";

export const useMembershipStore = defineStore(storeName, () => {
  const { loading, getMembershipList, fetchMembershipList } = useMembershipList();

  const dataList = ref<MembershipLevels[]>([])
  const lastFetched = ref<number | null>(null)

  const fetchMembershipStore = async () => {
    const now = Date.now()
    if (dataList.value.length > 0 && lastFetched.value && now - lastFetched.value < TTL_MS) return

    await fetchMembershipList()
    dataList.value = getMembershipList.value
    lastFetched.value = now
  }

  const getListData = computed(() => dataList.value);
  
  return {
    dataList,
    fetchMembershipStore,
    getListData,
    lastFetched,
    loading,
  };
}, {
  persist: {
    key: process.client && window?.location?.pathname.startsWith('/admin')
    ? 'MembershipPiniaAdmin'
    : 'MembershipPiniaClient',
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    paths: ['dataList','lastFetched'],
  }
})
