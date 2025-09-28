import { computed } from "vue";
import type { Ref } from "vue";
import type { ProductDTO } from '@/server/types/dto/product.dto';
import type { ProductReviewPaginationDTO } from '@/server/types/dto/product-review.dto';
import { useWishlistStore } from '@/stores/client/users/useWishlistStore';

export const useProductDetailHandle = (
  detailData: Ref<ProductDTO | null>,
  listReview: Ref<ProductReviewPaginationDTO | null>
) => {

  const storeWishlist = useWishlistStore()

  const percentDiscount = computed(() => {
    if (!detailData.value || !detailData.value.price || detailData.value.price <= 0) return "0%";
    return Math.round(((detailData.value.price - (detailData.value.priceDiscounts ?? 0)) / detailData.value.price) * 100) + "%";
  });

  const getSummaryReview = computed(() => listReview.value?.summary);

  const isFavorite = computed(() =>
    storeWishlist.isInWishlist(detailData.value?.id || '')
  )

  const toggleLike = (id: string) => {
    if (storeWishlist.isInWishlist(id)) {
      storeWishlist.handleDeleteWishlist(id)
    } else {
      storeWishlist.handleAddWishlist(id)
    }
  }

  return {
    percentDiscount,
    getSummaryReview,
    isFavorite,
    toggleLike,
  }
}
