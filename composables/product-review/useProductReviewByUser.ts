import { ref, computed } from "vue";
import { productReviewAPI } from "@/services/productReview.service";
import type { ProductReviewPaginationDTO } from '@/server/types/dto/product-review.dto';

export const useProductReviewByUser = () => {
  
  const listData = ref<ProductReviewPaginationDTO>();

  const fetchListReview = async (userId: string, status: string, page: number, limit: number) => {
    try {
      const data: ProductReviewPaginationDTO = await productReviewAPI.getReviewsByUser(userId, status, page, limit)
      if(data.code === 0) {
        listData.value = data
        return data
      }
    } catch (err) {
      console.error('Error product all', err)
    }
  }

  const getListReview = computed(() => listData.value);

  return {
    fetchListReview,
    getListReview
  }
}