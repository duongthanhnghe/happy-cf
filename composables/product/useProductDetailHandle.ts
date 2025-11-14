import { computed } from "vue";
import type { Ref } from "vue";
import type { ProductDTO, SelectedOptionPushDTO } from '@/server/types/dto/v1/product.dto';
import type { ProductReviewPaginationDTO } from '@/server/types/dto/v1/product-review.dto';
import { useWishlistStore } from '@/stores/client/users/useWishlistStore';
// import { useProductDetail } from '@/composables/product/useProductDetail'

export const useProductDetailHandle = (
  detailData: Ref<ProductDTO | null>,
  listReview: Ref<ProductReviewPaginationDTO | null>,
  // popups: Ref<{order:boolean,edit:boolean}>,
  // selectedOptionsData: Ref<SelectedOptionPushDTO[]>,
) => {

  // const { fetchDetailProduct } = useProductDetail()

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

  // const getProductDetailApi = async (id: string) => {
  //   await fetchDetailProduct(id);
  //   togglePopup("order", true);
  //   // calcTotalPrice("order");
  //   selectedOptionsData.value = [];
  // };

  // const togglePopup = (popupId: keyof typeof popups.value, value: any) => {
  //   if (popups.value[popupId] !== undefined) popups.value[popupId] = value;
  // };

  // const getPopupState = (popupId: keyof typeof popups.value) => {
  //   return popups.value[popupId] || false;
  // };

  return {
    percentDiscount,
    getSummaryReview,
    isFavorite,
    toggleLike,
    // getProductDetailApi,
    // togglePopup,
    // getPopupState,
  }
}
