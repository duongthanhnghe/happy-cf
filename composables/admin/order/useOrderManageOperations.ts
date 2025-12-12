import type { Ref } from 'vue';
import type { OrderDTO, OrderPaginationDTO } from "@/server/types/dto/v1/order.dto";
import { watch } from 'vue';
import { Loading } from '@/utils/global';
import { ordersAPI } from '@/services/v1/admin/orders.service';
import { ORDER_STATUS } from '@/shared/constants/order-status';
import { showConfirm, showSuccess, showWarning } from '@/utils/toast';
import { paymentTransactionsAPI } from '@/services/v1/admin/payment-transaction.service';
import type { PaymentMethod, PaymentTransactionStatus } from '@/server/types/dto/v1/payment-transaction.dto';
import type { TableOpt } from '@/server/types';
import { useOrderStatus } from '@/composables/shared/order/useOrderStatus';

export const useOrderOperations = (
  dataListOrder: Ref<OrderPaginationDTO|null>,
  serverItems: Ref<OrderDTO[]>,
  loadingTable: Ref<boolean>,
  totalItems: Ref<number>,
  search: Ref<string>,
  fromDay: Ref<string>,
  toDay: Ref<string>,
  currentTableOptions: Ref<TableOpt>,
  filterStatusOrder: Ref<string>,
  filterStatusTransactionOrder:Ref<string>,
  isTogglePopupAdd: Ref<boolean>,
) => {

  const { getListOrderStatus, fetchOrderStatus } = useOrderStatus();
  

  const getListAllProduct = async () => {
    const from = fromDay.value !== '' ? new Date(fromDay.value).toISOString().slice(0, 10) : ''
    const to = toDay.value !== '' ? new Date(toDay.value).toISOString().slice(0, 10) : ''

    const data = await ordersAPI.getAll(currentTableOptions.value.page, currentTableOptions.value.itemsPerPage, from, to, search.value, filterStatusOrder.value, filterStatusTransactionOrder.value);

    if(data.code !== 0) return
    dataListOrder.value = data
    totalItems.value = data.pagination.total
    currentTableOptions.value.page = data.pagination.page
    currentTableOptions.value.itemsPerPage = data.pagination.limit
  }

  const ListAllProductApi = {
    async fetch({
      items,
    }: {
      items: OrderDTO[],
    }) {
      return new Promise(resolve => {
        setTimeout(() => {
          let filtered = items.slice()
        
          resolve({ items: filtered })
        }, 300)
      })
    }
  }

  async function loadItemsProduct(opt:TableOpt) {
    loadingTable.value = true;

    await getListAllProduct();
    if(!dataListOrder.value?.data) return

    const { items } = (await ListAllProductApi.fetch({
      items: dataListOrder.value?.data,
    })) as { items: OrderDTO[] }

    serverItems.value = items;
    if(dataListOrder.value?.data) totalItems.value = dataListOrder.value.pagination.total
    loadingTable.value = false;
  }

  watch([search, fromDay, toDay, filterStatusOrder, filterStatusTransactionOrder], () => {
    loadItemsProduct(currentTableOptions.value);
  });

  watch(() => [currentTableOptions.value.page,currentTableOptions.value.itemsPerPage], () => {
    loadItemsProduct(currentTableOptions.value);
  })

  const handleTogglePopupAdd = (value: boolean) => {
    isTogglePopupAdd.value = value;
  };

  const handleReload = async () => {
    await loadItemsProduct(currentTableOptions.value);
  }

  const handleDelete = async (orderId: string) => {
    const confirmed = await showConfirm('Bạn có chắc xoá?')
    if (!confirmed) return
  
    Loading(true);
    try {
      const data = await ordersAPI.delete(orderId)
      if(data.code === 0) {
        showSuccess(data.message ?? '')
        if(dataListOrder.value?.data){
          dataListOrder.value.data = dataListOrder.value?.data?.filter(item => 
            item.id !== orderId
          )
        }
        handleReload()
      } else {
        showWarning(data.message ?? '')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const handleUpdateStatusOrder = async (orderId:string, idStatusNew:string, statusName: string, transactionId: string | undefined, amount: number, method: PaymentMethod) => {
    if(idStatusNew === ORDER_STATUS.CANCELLED || idStatusNew === ORDER_STATUS.COMPLETED ) {
      const confirmed = await showConfirm(`Bạn có chắc chan: ${statusName}?`)
      if (!confirmed) return
    }

    Loading(true);
    try {
      const data = await ordersAPI.updateStatusOrder(orderId, idStatusNew)
      if(data.code === 0) {
        showSuccess(data.message ?? '')
        if(!transactionId){
          if(idStatusNew === ORDER_STATUS.CONFIRMED || idStatusNew === ORDER_STATUS.DELIVERING || idStatusNew === ORDER_STATUS.COMPLETED) {
            await paymentTransactionsAPI.create({orderId, amount, method})
          }
        }
        handleReload()
      } else {
        showWarning(data.message ?? '')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const handleUpdateStatusTransactionOrder = async (transactionId:string, status: PaymentTransactionStatus) => {
    Loading(true);
    try {
      const data = await paymentTransactionsAPI.updateStatus(transactionId, status)
      if(data.code === 0) {
        showSuccess(data.message ?? '')
        handleReload()
      } else {
        showWarning(data.message ?? '')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const resetFilter = () => {
    search.value = ''
    fromDay.value = ''
    toDay.value = ''
    filterStatusOrder.value = ''
    filterStatusTransactionOrder.value = ''
    currentTableOptions.value.page = 1
    currentTableOptions.value.itemsPerPage = 20
  }

  const statusListToShow = (order: OrderDTO) => {
    if (order.status.id === ORDER_STATUS.CANCELLED) return [];
    if(getListOrderStatus.value.length === 0) fetchOrderStatus()

    if (order.cancelRequested || order.status.id === ORDER_STATUS.COMPLETED) {
      return getListOrderStatus.value.filter(s => s.id === ORDER_STATUS.CANCELLED);
    }

    return getListOrderStatus.value;
  };

  return {
    handleTogglePopupAdd,
    getListAllProduct,
    loadItemsProduct,
    handleReload,
    handleDelete,
    handleUpdateStatusOrder,
    handleUpdateStatusTransactionOrder,
    resetFilter,
    statusListToShow,
  };
};