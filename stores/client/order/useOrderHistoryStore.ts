import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { OrderPaginationDTO} from '@/server/types/dto/v1/order.dto'
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { useOrderAccountUtils } from "@/composables/order/useOrderAccountUtils";
import { useOrderList } from "@/composables/order/useOrderList";
import { useOrderListUtils } from "@/composables/order/useOrderListUtils";

export const useOrderHistoryStore = defineStore("OrderHistory", () => {
  const storeAccount = useAccountStore();

  const filterStatusOrder = ref<string>('')
  const items = ref<OrderPaginationDTO|null>(null)
  const limit = 10

  const { fetchListOrder, getListOrder, loadingData} = useOrderList();
  const { handleCancelOrder, handlePaymentOrder } = useOrderAccountUtils(items);
  const { getApiData, loadItems } = useOrderListUtils(items,filterStatusOrder,getListOrder,limit,fetchListOrder,storeAccount);

  const getItems = computed(() => items.value?.data)

  return {
    filterStatusOrder,
    loadingData,
    getApiData,
    loadItems,
    handlePaymentOrder,
    handleCancelOrder,
    getItems,
  };
});
