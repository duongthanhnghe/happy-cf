import type { Ref } from 'vue';
import { watch, ref, computed } from 'vue';
import { ORDER_STATUS } from "@/shared/constants/order-status"
import type { OrderMappingNew } from '@/server/types/dto/v1/order.dto'

export const useOrderDetailHandlers = (
  storeHistory: any,
  storeOrderStatus: any,
  getDetailOrder: Ref<OrderMappingNew|null>,
  idOrder: Ref<string>,
  fetchProvinceDetail: (provinceCode: number) => void,
  fetchDistrictDetail: (districtCode: number) => void,
  fetchWardDetail: (wardCode: number, districtCode: number) => void,
  fetchOrderDetail: (id: string) => void,
) => {

  const elCurrent = ref(ORDER_STATUS.PENDING)
  const hasFetched = ref(false)

  const activeIndex = computed(() => {
    return storeOrderStatus.getListData.findIndex((item: any) => item.id === elCurrent.value)
  })

  watch(() => idOrder.value, (newId) => {
      if(storeHistory.isTogglePopupDetail || storeHistory.getCheckPageDetail){
        fetchOrderDetail(newId);
        hasFetched.value = false;
      }
    },
    { immediate: storeHistory.getCheckPageDetail ? true : false }
  )

  watch(() => getDetailOrder.value?.status.id, (newId) => {
      if (newId) {
        elCurrent.value = newId || ORDER_STATUS.PENDING
      }
    },
    { immediate: true }
  )

  watch(
    () => getDetailOrder.value,
    (val) => {
      if (val && !hasFetched.value) {
        hasFetched.value = true;
        if (val.provinceCode) fetchProvinceDetail(val.provinceCode)
        if (val.districtCode) fetchDistrictDetail(val.districtCode)
        if (val.wardCode && val.districtCode) fetchWardDetail(val.wardCode, val.districtCode)
      }
    },
    { immediate: true }
  )

  const totalDiscountVoucher = computed(() => {
    return getDetailOrder.value?.voucherUsage?.reduce((total, voucher) => total + (voucher.discount || 0), 0) || 0
  })


  return {
    activeIndex,
    totalDiscountVoucher
  };
};