import { ref, computed } from "vue";
import { productReviewAPI } from "@/services/v1/admin/productReview.service";
import type { ProductReviewPaginationDTO } from '@/server/types/dto/v1/product-review.dto';

export const useAdminProductReviewAll = () => {
  
  const listData = ref<ProductReviewPaginationDTO>();

  const fetchListReviewAll = async (page: number, limit: number) => {
    try {
      const data = await productReviewAPI.getAll(page, limit)
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
    fetchListReviewAll,
    getListReview
  }
}