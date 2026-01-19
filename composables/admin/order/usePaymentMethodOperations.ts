import type { Ref } from 'vue';
import { usePaymentMethod } from './usePaymentMethod';
import type { PaymentDTO } from '@/server/types/dto/v1/order.dto';
import { useToggleActiveStatus } from '@/composables/utils/useToggleActiveStatus';
import { ordersAPI } from "@/services/v1/admin/orders.service";

export const usePaymentMethodOperations = (
  dataList: Ref<PaymentDTO[]>,
  serverItems: Ref<PaymentDTO[]>,
  loadingTable: Ref<boolean>,
  totalItems: Ref<number>,
) => {
  const { getListPayment, fetchPaymentMethod } = usePaymentMethod()

  const getListData = async () => {
    await fetchPaymentMethod()

    if(!getListPayment.value) return
    dataList.value = getListPayment.value
  }

  const ListAllApi = {
    async fetch({ items }: {
      items: PaymentDTO[],
    }) {
      return new Promise(resolve => {
        setTimeout(() => {
          let filtered = items.slice()
          resolve({ items: filtered })
        }, 300)
      })
    },
  }

  async function loadItems() {
    loadingTable.value = true
    await getListData()

    const { items } = await ListAllApi.fetch({
      items: dataList.value || [],
    }) as { items: PaymentDTO[] }

    serverItems.value = items
    if(dataList.value) totalItems.value = dataList.value.length

    loadingTable.value = false
  }

  const { toggleActive } = useToggleActiveStatus(ordersAPI.toggleActivePayment, serverItems );

  return {
    getListData,
    loadItems,
    toggleActive,
  };
};