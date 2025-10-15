import { ref, computed } from "vue";
import { productReviewAPI } from "@/services/v1/productReview.service";
import type { ProductReviewPaginationDTO } from '@/server/types/dto/v1/product-review.dto';

export const useProductReviewByProduct = () => {
  
  const listData = ref<ProductReviewPaginationDTO>();

  const fetchListReview = async (productId: string, page: number, limit: number) => {
    try {
      const data: ProductReviewPaginationDTO = await productReviewAPI.getReviewsByProduct(productId, page, limit)
      if(data.code === 0) {
        listData.value = data
        return data
      }
    } catch (err) {
      console.error('Error product all', err)
    }
  }

  const getListReview = computed(() => listData.value || null);

  return {
    fetchListReview,
    getListReview
  }
}