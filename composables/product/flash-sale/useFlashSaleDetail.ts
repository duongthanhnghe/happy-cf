import { computed } from 'vue'
import { useState } from 'nuxt/app'
import { flashSalesAPI } from '@/services/v1/flash-sale.service'
import type { FlashSaleDTO } from '@/server/types/dto/v1/flash-sale.dto'

export const useFlashSaleDetail = () => {
  const listData = useState<FlashSaleDTO | null>(
    'flash-sale-detail',
    () => null
  )

  const loadingData = useState<boolean>(
    'flash-sale-detail-loading',
    () => false
  )

  const fetchFlashSaleDetail = async (id: string) => {
    try {
      loadingData.value = true
      const res = await flashSalesAPI.getDetail(id)

      if (res.code === 0) {
        listData.value = res.data
      }
    } catch (err) {
      console.error('Error fetchFlashSaleDetail', err)
    } finally {
      loadingData.value = false
    }
  }

  const getFlashSaleDetail = computed(() => listData.value)

  return {
    fetchFlashSaleDetail,
    getFlashSaleDetail,
    loadingData
  }
}