import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useMembershipList } from '@/composables/user/useMembershipList';
import type { MembershipLevels } from '@/server/types/dto/v1/user.dto'

const TTL_MS = 10 * 24 * 60 * 60 * 1000; // 10 days

export const useMembershipStore = defineStore("MembershipStore", () => {
  const { getMembershipList, fetchMembershipList } = useMembershipList();

  const dataList = ref<MembershipLevels[]>([])
  const lastFetched = ref<number | null>(null)
  const loading = ref(false)

  const fetchMembershipStore = async () => {
    const now = Date.now()
    if (dataList.value.length > 0 && lastFetched.value && now - lastFetched.value < TTL_MS) return

    loading.value = true
    try {
      await fetchMembershipList()
      dataList.value = getMembershipList.value
      lastFetched.value = now
    } finally {
      loading.value = false
    }
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
    key: 'MembershipPinia',
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    paths: ['dataList','lastFetched'],
  }
})
