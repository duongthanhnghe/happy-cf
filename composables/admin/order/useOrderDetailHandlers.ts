import type { Ref } from 'vue';

export const useOrderDetailHandlers = (
  togglePopupDetail: Ref<boolean>,
  fetchOrderDetail: (id: string) => Promise<void>,
) => {

  const handleTogglePopupDetail = async (value: boolean, orderId: string) => {
    if (value && orderId) {
      await fetchOrderDetail(orderId);
      togglePopupDetail.value = true;
    } else {
      togglePopupDetail.value = false;
    }
  }

  return {
    handleTogglePopupDetail,
  }
}
