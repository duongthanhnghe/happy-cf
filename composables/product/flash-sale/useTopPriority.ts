import { computed } from 'vue'
import { useState } from 'nuxt/app'
import { flashSalesAPI } from '@/services/v1/flash-sale.service'
import type { FlashSaleDTO } from '@/server/types/dto/v1/flash-sale.dto'

export const useTopPriority = () => {
  const listData = useState<FlashSaleDTO>(
    'flash-sale-top-priority',
    () => {}
  )

  const loadingData = useState<boolean>(
    'flash-sale-top-priority-loading',
    () => false
  )

  const fetchTopPriority = async () => {
    try {
      loadingData.value = true
      const res = await flashSalesAPI.getTopPriority()

      if (res.code === 0) {
        listData.value = res.data
      }
    } catch (err) {
      console.error('Error fetchTopPriority', err)
    } finally {
      loadingData.value = false
    }
  }

  const getTopPriority = computed(() => listData.value)

  return {
    fetchTopPriority,
    getTopPriority,
    loadingData
  }
}