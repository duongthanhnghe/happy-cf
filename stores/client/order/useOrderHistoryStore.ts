import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { ordersAPI } from "@/services/v1/orders.service";
import type { OrderDTO, OrderPaginationDTO} from '@/server/types/dto/v1/order.dto'
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { useOrderStatusStore } from '@/stores/shared/useOrderStatusStore'
import { useRouter } from 'vue-router'
import { ROUTES } from '@/shared/constants/routes';

export const useOrderHistoryStore = defineStore("OrderHistory", () => {
  const storeAccount = useAccountStore();
  const storeOrderStatus = useOrderStatusStore();
  const router = useRouter()

  const isTogglePopupDetail = ref(false)
  const idOrderPopupDetail = ref<string>('')
  const filterStatusOrder = ref<string>('')
  const items = ref<OrderPaginationDTO|null>(null)
  const limit = 10
  const checkPageDetail = ref(false)
  const loadingData = ref(false)

  const getApiData = async () => {
    const userId = storeAccount.getUserId;
    if (!userId) return
    loadingData.value = true;

    const data = await ordersAPI.getByUserId(userId, 1, limit, filterStatusOrder.value);
    if (data.code !== 0) return (loadingData.value = false);

    items.value = data;

    if (filterStatusOrder.value) {
      items.value.data = items.value.data.filter((order: OrderDTO) =>
        order.status.id === filterStatusOrder.value
      );
    }

    loadingData.value = false;
  };

  async function loadItems({ done }: { done: (status: 'ok' | 'empty') => void }) {
    if(!items.value || !storeAccount.getUserId) return done('empty');
    try {
      const currentPage = items.value.pagination.page
      const totalPages = items.value.pagination.totalPages

      if (currentPage >= totalPages) return done('empty');

      const nextPage = currentPage + 1
      const data = await ordersAPI.getByUserId(storeAccount.getUserId,nextPage, limit, filterStatusOrder.value)

      if (data && data.data && data.data.length > 0) {
        items.value.data.push(...data.data)
        items.value.pagination = data.pagination
        done('ok')
      } else {
        done('empty')
      }
    } catch (err) {
      console.error('Error loading more products:', err)
      done('empty')
    }
  }

  const handleTogglePopupDetail = (value: boolean, id: string) => {
    isTogglePopupDetail.value = value;
    idOrderPopupDetail.value = id;
  };

  const setCheckPageDetail = (value: boolean) => {
    checkPageDetail.value = value
  }

  const handlePaymentOrder = (orderId: string, orderCode: string, amount: number) => {
    router.push({
      path: ROUTES.PUBLIC.PAYMENT.path,
      query: {
        orderId,
        orderCode,
        amount,
      }
    })
  }

  watch([filterStatusOrder], () => {
    items.value = null;
    getApiData()
  });

  watch(() => [isTogglePopupDetail.value,checkPageDetail.value], async (newValue) => {
    if(newValue && storeOrderStatus.getListData.length === 0) await storeOrderStatus.fetchOrderStatusStore()
  }, { immediate: true })

  const getItems = computed(() => items.value?.data)
  const getIdOrderPopupDetail = computed(() => idOrderPopupDetail.value);
  const getCheckPageDetail = computed(() => checkPageDetail.value)
  const getOrderStatus = computed(() => storeOrderStatus.getListData)

  return {
    filterStatusOrder,
    isTogglePopupDetail,
    idOrderPopupDetail,
    loadingData,
    getApiData,
    loadItems,
    handleTogglePopupDetail,
    setCheckPageDetail,
    handlePaymentOrder,
    getItems,
    getIdOrderPopupDetail,
    getCheckPageDetail,
    getOrderStatus
  };
});
