import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { OrderPaginationDTO} from '@/server/types/dto/v1/order.dto'
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { useOrderStatusStore } from '@/stores/shared/useOrderStatusStore'
import { useOrderDetailUtils } from "@/composables/order/useOrderDetailUtils";
import { useOrderList } from "@/composables/order/useOrderList";
import { useOrderListUtils } from "@/composables/order/useOrderListUtils";
import { useOrderDetailState } from "@/composables/order/useOrderDetailState";

export const useOrderHistoryStore = defineStore("OrderHistory", () => {
  const storeAccount = useAccountStore();
  const storeOrderStatus = useOrderStatusStore();

  const filterStatusOrder = ref<string>('')
  const items = ref<OrderPaginationDTO|null>(null)
  const limit = 10
  const stateOrderDetail = useOrderDetailState();

  const { fetchListOrder, getListOrder, loadingData} = useOrderList();
  const { handleCancelOrder, handlePaymentOrder, handleTogglePopupDetail, setCheckPageDetail } = useOrderDetailUtils(items,stateOrderDetail.isTogglePopupDetail,stateOrderDetail.checkPageDetail,stateOrderDetail.idOrderPopupDetail,storeOrderStatus);
  const { getApiData, loadItems } = useOrderListUtils(items,filterStatusOrder,getListOrder,limit,fetchListOrder,storeAccount);

  const getItems = computed(() => items.value?.data)
  const getOrderStatus = computed(() => storeOrderStatus.getListData)

  return {
    ...stateOrderDetail,
    filterStatusOrder,
    loadingData,
    getApiData,
    loadItems,
    handleTogglePopupDetail,
    setCheckPageDetail,
    handlePaymentOrder,
    handleCancelOrder,
    getItems,
    getOrderStatus
  };
});
