import type { Ref } from 'vue';
import type { CreateOrderShippingDTO, OrderDTO, OrderPaginationDTO, OrderShippingDTO } from "@/server/types/dto/v1/order.dto";
import { unref, watch } from 'vue';
import { Loading } from '@/utils/global';
import { ordersAPI } from '@/services/v1/admin/orders.service';
import { ORDER_STATUS } from '@/shared/constants/order-status';
import { showConfirm, showSuccess, showWarning } from '@/utils/toast';
import { paymentTransactionsAPI } from '@/services/v1/admin/payment-transaction.service';
import type { PaymentMethod, PaymentTransactionStatus } from '@/server/types/dto/v1/payment-transaction.dto';
import type { TableOpt } from '@/server/types';
import { useOrderStatus } from '@/composables/shared/order/useOrderStatus';
import { useAdminShippingProviders } from './useAdminShippingProviders';
import { useAdminOrderShipping } from './useAdminOrderShipping';
import { useAdminOrderDetailStore } from '@/stores/admin/order/useOrderDetailStore';
type MaybeRef<T> = T | Ref<T>;

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
  defaultFormShipping: object,
  formShipping: MaybeRef<CreateOrderShippingDTO>,
  isTogglePopupCreateShipping: Ref<boolean>,
  isTogglePopupDetailShipping: Ref<boolean>,
  detailShipping: Ref<OrderShippingDTO|null>,
  filterStatusShipping: Ref<string>,
) => {

  const { getListOrderStatus, fetchOrderStatus } = useOrderStatus();
  const { getShippingProviders, fetchAllShippingProviders } = useAdminShippingProviders();
  const { getOrderShippingDetail, fetchOrderShippingDetail } = useAdminOrderShipping()
  const storeDetailOrder = useAdminOrderDetailStore()

  const getListAllProduct = async () => {
    const from = fromDay.value !== '' ? new Date(fromDay.value).toISOString().slice(0, 10) : ''
    const to = toDay.value !== '' ? new Date(toDay.value).toISOString().slice(0, 10) : ''

    const data = await ordersAPI.getAll(
      currentTableOptions.value.page, 
      currentTableOptions.value.itemsPerPage, 
      from, 
      to, 
      search.value, 
      filterStatusOrder.value, 
      filterStatusTransactionOrder.value,
      filterStatusShipping.value
    );

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
    if(getListOrderStatus.value.length === 0) await fetchOrderStatus()

    await getListAllProduct();
    if(!dataListOrder.value?.data) return

    const { items } = (await ListAllProductApi.fetch({
      items: dataListOrder.value?.data,
    })) as { items: OrderDTO[] }

    serverItems.value = items;
    if(dataListOrder.value?.data) totalItems.value = dataListOrder.value.pagination.total
    loadingTable.value = false;
  }

   watch(
    () => ({
      search: search.value,
      filterStatusOrder: filterStatusOrder.value,
      filterStatusTransactionOrder: filterStatusTransactionOrder.value,
      filterStatusShipping: filterStatusShipping.value,
      fromDay: fromDay.value,
      toDay: toDay.value,
      page: currentTableOptions.value.page,
      limit: currentTableOptions.value.itemsPerPage,
    }),
    () => {
      loadItemsProduct(currentTableOptions.value)
    },
    { deep: true }
  )

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

        if (storeDetailOrder.togglePopupDetail && storeDetailOrder.getDetailOrder?.id === orderId) {
          await storeDetailOrder.fetchOrderDetail(orderId)
        }

        await handleReload()
      } else {
        showWarning(data.message ?? '')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const handleUpdateStatusTransactionOrder = async (transactionId:string, status: PaymentTransactionStatus, orderId: string) => {
    Loading(true);
    try {
      const data = await paymentTransactionsAPI.updateStatus(transactionId, status)
      if(data.code === 0) {
        showSuccess(data.message ?? '')

        if (storeDetailOrder.togglePopupDetail && storeDetailOrder.getDetailOrder?.id === orderId) {
          await storeDetailOrder.fetchOrderDetail(orderId)
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

  const resetFilter = () => {
    search.value = ''
    fromDay.value = ''
    toDay.value = ''
    filterStatusOrder.value = ''
    filterStatusTransactionOrder.value = ''
    filterStatusShipping.value = ''
    currentTableOptions.value.page = 1
    currentTableOptions.value.itemsPerPage = 20
  }

  const statusListToShow = (order: OrderDTO) => {
    if (order.status.id === ORDER_STATUS.CANCELLED) return [];

    if (order.cancelRequested || order.status.id === ORDER_STATUS.COMPLETED) {
      return getListOrderStatus.value.filter(s => s.id === ORDER_STATUS.CANCELLED);
    }

    return getListOrderStatus.value;
  };

  const handlePopupCreateOrderShipping = async (orderId: string) => {
    if(!orderId) return
    unref(formShipping).orderId = orderId
    if(!getShippingProviders.value || getShippingProviders.value.length === 0) await fetchAllShippingProviders()
    isTogglePopupCreateShipping.value = true;
  }

  const handlePopupDetailOrderShipping = async (orderId: string) => {
    if(!orderId) return
    if(detailShipping.value?.id !== orderId) await fetchOrderShippingDetail(orderId)
    detailShipping.value = getOrderShippingDetail.value
    isTogglePopupDetailShipping.value = true;
  }

  const handleCreateOrderShipping = async () => {
    Loading(true)
    try {
      const payload = unref(formShipping)

      const res = await ordersAPI.createOrderShipping(payload)

      if (res.code === 0) {
        showSuccess('Tạo vận đơn thành công')

        if (storeDetailOrder.togglePopupDetail && storeDetailOrder.getDetailOrder?.id === payload.orderId) {
          await storeDetailOrder.fetchOrderDetail(payload.orderId)
        }

        await handleReload()
      } else {
        showWarning(res.message ?? 'Tạo vận đơn thất bại')
      }
      
    } catch (err: any) {
      console.error('Create order shipping error:', err)
      showWarning(err.message)
    } finally {
      Loading(false)
      Object.assign(formShipping, defaultFormShipping)
      isTogglePopupCreateShipping.value = false
    }
  }

  const handleUpdateOrderShippingStatus = async (
    shippingId: string,
    status: string,
    statusText: string,
    orderId: string,
  ) => {
    const confirmed = await showConfirm('Bạn có chắc cập nhật trạng thái vận đơn?')
    if (!confirmed) return

    Loading(true)
    try {
      const res = await ordersAPI.updateOrderShippingStatus(shippingId, {
        status,
        statusText
      })

      if (res.code === 0) {
        showSuccess('Cập nhật trạng thái vận đơn thành công')

        if (storeDetailOrder.togglePopupDetail && storeDetailOrder.getDetailOrder?.id === orderId) {
          await storeDetailOrder.fetchOrderDetail(orderId)
        }

        await handleReload()
      } else {
        showWarning(res.message ?? 'Cập nhật vận đơn thất bại')
      }
    } catch (err) {
      console.error('Update shipping status error:', err)
      showWarning('Có lỗi xảy ra khi cập nhật vận đơn')
    } finally {
      Loading(false)
    }
  }

  const handleFilterByOrderStatus = async (statusId: string) => {
    if (filterStatusOrder.value === statusId) {
      filterStatusOrder.value = ''
    } else {
      filterStatusOrder.value = statusId
    }

    currentTableOptions.value.page = 1
  }

  const handleExport = async () => {
    Loading(true)
    const fromDate = fromDay.value !== '' ? new Date(fromDay.value).toISOString().slice(0, 10) : ''
    const toDate = toDay.value !== '' ? new Date(toDay.value).toISOString().slice(0, 10) : ''

    const res = await ordersAPI.exportOrders({
      fromDate,
      toDate,
      search: search.value || undefined,
      statusId: filterStatusOrder.value || undefined,
      transactionId: filterStatusTransactionOrder.value || undefined,
      shippingStatus: filterStatusShipping.value || undefined,
    })
    Loading(false)
    if(res.code) showSuccess(res.message ?? 'Export thành công')
  };

  const handlePrintBill = async (orderId: string) => {
    if (!orderId) return

    try {
      await ordersAPI.printBill(orderId)
    } catch (err: any) {
      showWarning(err?.message || "Không thể in hóa đơn")
    }
  }

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
    handleCreateOrderShipping,
    handleUpdateOrderShippingStatus,
    getShippingProviders,
    handlePopupCreateOrderShipping,
    handlePopupDetailOrderShipping,
    handleFilterByOrderStatus,
    handleExport,
    handlePrintBill,
  };
};