import { ref, computed } from 'vue'
import { useState } from 'nuxt/app'
import { promotionGiftAPI } from '@/services/v1/promotion-gift.services'
import type {
  GetAvailablePromotionGiftsBody,
  AvailablePromotionGiftDTO,
} from '@/server/types/dto/v1/promotion-gift.dto'

export const useAvailablePromotionGifts = () => {

  const listData = useState<AvailablePromotionGiftDTO[] | null>(
    'available-promotion-gifts',
    () => null
  )

  const loadingData = ref<boolean>(false)

  const fetchAvailablePromotionGifts = async (
    payload: GetAvailablePromotionGiftsBody
  ) => {
    try {
      loadingData.value = true

      const res = await promotionGiftAPI.getAvailablePromotionGifts(payload)

      if (res.code === 0) {
        listData.value = res.data
      } else {
        listData.value = []
      }
    } catch (error) {
      console.error('Error fetching available promotion gifts:', error)
      listData.value = []
    } finally {
      loadingData.value = false
    }
  }

  const getAvailablePromotionGiftsApi = computed(() => listData.value)

  return {
    loadingData,
    fetchAvailablePromotionGifts,
    getAvailablePromotionGiftsApi,
  }
}
