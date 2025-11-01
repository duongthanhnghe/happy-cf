import { ref } from 'vue'
import { useOrderHistoryStore } from '@/stores/client/order/useOrderHistoryStore'

export function useHandle() {
  const idOrder = ref<string>('')

  const handleDetailPopup = (id: string) => {
    const storeHistory = useOrderHistoryStore()
    storeHistory.handleTogglePopupDetail(true, id)
    idOrder.value = id
  }

  return {
    idOrder,
    handleDetailPopup
  }
}
