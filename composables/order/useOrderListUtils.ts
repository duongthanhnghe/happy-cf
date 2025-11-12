import type { Ref } from 'vue';
import type { OrderDTO, OrderPaginationDTO } from "@/server/types/dto/v1/order.dto";
import { watch } from 'vue';

export const useOrderListUtils = (
  items: Ref<OrderPaginationDTO|null>,
  filterStatusOrder: Ref<string>,
  getListOrder: Ref<OrderPaginationDTO|null>,
  limit: number,
  fetchListOrder: (userId: string, page: number, limit: number, status: string) => Promise<void>,
  storeAccount: any,
) => {
  
  const getApiData = async () => {
    const userId = storeAccount.getUserId;
    if (!userId) return

    if(!items.value) await fetchListOrder(userId, 1, limit, filterStatusOrder.value);

    items.value = getListOrder.value;

    if (filterStatusOrder.value && items.value) {
      items.value.data = items.value?.data.filter((order: OrderDTO) =>
        order.status.id === filterStatusOrder.value
      );
    }
  };

  async function loadItems({ done }: { done: (status: 'ok' | 'empty') => void }) {
    if(!items.value || !storeAccount.getUserId) return done('empty');
    try {
      const currentPage = items.value.pagination.page
      const totalPages = items.value.pagination.totalPages

      if (currentPage >= totalPages) return done('empty');

      const nextPage = currentPage + 1
      
      await fetchListOrder(storeAccount.getUserId,nextPage, limit, filterStatusOrder.value);
      if(!getListOrder.value) return

      if (getListOrder.value && getListOrder.value.data && getListOrder.value.data.length > 0) {
        items.value.data.push(...getListOrder.value.data)
        items.value.pagination = getListOrder.value.pagination
        done('ok')
      } else {
        done('empty')
      }
    } catch (err) {
      console.error('Error loading more products:', err)
      done('empty')
    }
  }

  watch([filterStatusOrder], () => {
    items.value = null;
    getApiData()
  });

  return {
    getApiData,
    loadItems,
  };
};