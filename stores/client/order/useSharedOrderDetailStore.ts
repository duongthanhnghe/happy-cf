import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ORDER_STATUS } from "@/shared/constants/order-status"
import { useOrderDetail } from '@/composables/order/useOrderDetail'
import { useOrderStatusStore } from '@/stores/client/order/useOrderStatusStore';
import { useSharedOrderDetailHandlers } from '@/composables/shared/order/useSharedOrderDetailHandlers';

export const useSharedOrderDetailStore = defineStore('useSharedOrderDetailStore', () => {

  const togglePopupDetail = ref(false)
  const elCurrent = ref(ORDER_STATUS.PENDING)

  const { getDetailOrder, fetchOrderDetail } = useOrderDetail()
  const storeOrderStatus = useOrderStatusStore()

  const activeIndex = computed(() => {
    return storeOrderStatus.getListData.findIndex(
      (item: any) => item.id === elCurrent.value
    )
  })

  const totalDiscountVoucher = computed(() => {
    return getDetailOrder.value?.voucherUsage?.reduce(
      (total, voucher) => total + (voucher.discount || 0),
      0
    ) || 0
  })

  const { handleTogglePopupDetail } = useSharedOrderDetailHandlers(
    togglePopupDetail,
    fetchOrderDetail,
  )

  return {
    togglePopupDetail,
    getDetailOrder,
    elCurrent,
    activeIndex,
    totalDiscountVoucher,
    handleTogglePopupDetail,
    fetchOrderDetail,
  }
})
