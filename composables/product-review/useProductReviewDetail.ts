import { ref, computed } from "vue";
import { productReviewAPI } from "@/services/productReview.service";
import type { ProductReviewWithProductDTO } from '@/server/types/dto/product-review.dto';

export const useProductReviewDetail = () => {
  
  const detailData = ref<ProductReviewWithProductDTO|null>(null);

  const fetchDetailReview = async (reviewId: string) => {
    try {
      const data = await productReviewAPI.getById(reviewId)
      if(data.code === 0) {
        detailData.value = data.data
        return data
      }
    } catch (err) {
      console.error('Error product all', err)
    }
  }

  const getDetailReview = computed(() => detailData.value);

  return {
    fetchDetailReview,
    getDetailReview
  }
}