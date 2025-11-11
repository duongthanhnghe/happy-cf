import { ref, computed } from "vue";
import { productReviewAPI } from "@/services/v1/productReview.service";
import type { ProductReviewPaginationDTO } from '@/server/types/dto/v1/product-review.dto';
import { useState } from "nuxt/app";

export const useProductReviewByProduct = () => {
  
  const listData = useState<ProductReviewPaginationDTO | null>(
    'product-review',
    () => null
  )
  const loading = ref(false);

  const fetchListReview = async (productId: string, page: number, limit: number) => {
    loading.value = true;
    try {
      const data: ProductReviewPaginationDTO = await productReviewAPI.getReviewsByProduct(productId, page, limit)
      if(data.code === 0) {
        listData.value = data
        return data
      }
    } catch (err) {
      console.error('Error product all', err)
    } finally {
      loading.value = false;
    }
  }

  const getListReview = computed(() => listData.value || null);

  return {
    loading,
    fetchListReview,
    getListReview
  }
}