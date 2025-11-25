import { ref, computed } from "vue";
import { ordersAPI } from "@/services/v1/orders.service";
import type { PendingRewardData } from "@/server/types/dto/v1/reward-history.dto";

export const usePendingRewardPoints = () => {

  const pendingReward = ref<PendingRewardData | null>(null);
  const loadingReward = ref(false);

  const fetchPendingRewardPoints = async (userId: string) => {
    if(!userId) return ''

    loadingReward.value = true;
    try {
      const res = await ordersAPI.getPendingRewardPoints(userId);
      if (res.code === 0) {
        pendingReward.value = res.data;
      } else {
        console.warn("fetchPendingRewardPoints error:", res.message);
        pendingReward.value = { totalPendingPoints: 0, orders: 0 };
      }
    } catch (err) {
      console.error("Error fetchPendingRewardPoints:", err);
      pendingReward.value = { totalPendingPoints: 0, orders: 0 };
    } finally {
      loadingReward.value = false;
    }
  };

  const getPendingReward = computed(() => pendingReward.value);

  return {
    fetchPendingRewardPoints,
    getPendingReward,
    loadingReward,
  };
};
