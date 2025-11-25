import { ref, computed } from "vue";
import { productReviewAPI } from "@/services/v1/productReview.service";
import type { ProductReviewPaginationDTO } from '@/server/types/dto/v1/product-review.dto';

export const useProductReviewByUser = () => {
  
  const listData = ref<ProductReviewPaginationDTO>();
  const loadingData = ref<boolean>(false);

  const fetchListReview = async (userId: string, status: string, page: number, limit: number) => {
    loadingData.value = true
    try {
      const data: ProductReviewPaginationDTO = await productReviewAPI.getReviewsByUser(userId, status, page, limit)
      if(data.code === 0) {
        listData.value = data
        return data
      }
    } catch (err) {
      console.error('Error product all', err)
    } finally {
      loadingData.value = false
    }
  }

  const getListReview = computed(() => listData.value);

  return {
    fetchListReview,
    getListReview,
    loadingData,
  }
}