import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useOrderDetail } from '@/composables/admin/order/useOrderDetail'
import { useOrderDetailHandlers } from '@/composables/admin/order/useOrderDetailHandlers';

export const useAdminOrderDetailStore = defineStore('useAdminOrderDetailStore', () => {

  const togglePopupDetail = ref(false)
  const toggleAction = ref(false);

  const { getDetailOrder, fetchOrderDetail } = useOrderDetail()

  const totalDiscountVoucher = computed(() => {
    return getDetailOrder.value?.voucherUsage?.reduce(
      (total, voucher) => total + (voucher.discount || 0),
      0
    ) || 0
  })

  const operations = useOrderDetailHandlers(
    togglePopupDetail,
    toggleAction,
    fetchOrderDetail,
  )

  const promotionGiftUsages = computed(() => {
    return getDetailOrder.value?.promotionGiftUsages ?? []
  })

  return {
    togglePopupDetail,
    getDetailOrder,
    totalDiscountVoucher,
    ...operations,
    fetchOrderDetail,
    promotionGiftUsages,
    toggleAction,
  }
})
