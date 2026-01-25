import { watch, computed, type ComputedRef } from "vue";
import { defineStore } from "pinia";
import { useProductDetail } from '@/composables/product/useProductDetail'
import { useProductDetailHandle } from '@/composables/product/useProductDetailHandle'
import { useProductRelated } from '@/composables/product/useProductRelated'
import { useProductReviewByProduct } from '@/composables/product-review/useProductReviewByProduct'
import { usePagination } from '@/utils/paginationHandle'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useAvailableVouchersForOrder } from "@/composables/voucher/useAvailableVouchers";
import { useProductDetailOperations } from "@/composables/product/useProductDetailOperations";
import { useProductDetailState } from "@/composables/product/useProductDetailState";
import { useAccountStore } from "../users/useAccountStore";
import { useAvailablePromotionGifts } from "@/composables/promotion-gift/useAvailablePromotionGifts";

export const useProductDetailStore = defineStore("ProductDetailStore", () => {
  const { getDetailProduct } = useProductDetail()
  const { getListProductRelated, loading: loadingListRelated } = useProductRelated()
  const { getListReview, fetchListReview, loading: loadingListReviews } = useProductReviewByProduct()
  const { getVoucherProduct, loading: loadingListVoucher } = useAvailableVouchersForOrder();
  const {
   loadingData: loadingDataPromotionGift,
  getAvailablePromotionGiftsApi,
} = useAvailablePromotionGifts()
  
  const storeCart = useCartStore();
  const storeAccount = useAccountStore();
  const state = useProductDetailState();

  const variantImages = computed(() => {
    if (!getDetailProduct.value?.variantCombinations) return [];
    
    return getDetailProduct.value.variantCombinations
      .filter(item => item.stock !== 0 && item.inStock && item.image?.trim() !== '' )
      .map(v => v.image)
  });

  const galleryImages = computed(() => {
    const mainImg = getDetailProduct.value?.image ? [{ src: getDetailProduct.value.image }] : [];

    const listImgs = getDetailProduct.value?.listImage?.map(i => ({ src: i.src })) || [];

    const variantImgs = variantImages.value.map(img => ({ src: img }));

    return [...mainImg, ...listImgs, ...variantImgs];
  }) as ComputedRef<{ src: string }[]>;

  const utils = useProductDetailHandle(
    getDetailProduct,
    getListReview,
    state.toggleDescription,
    state.mainSwiper,
    state.thumbsSwiper,
    state.isTogglePopupNote,
    state.isDetailInfoActive,
    state.elScrollInfo,
    galleryImages,
  )

  const operations = useProductDetailOperations(
    storeCart,
  );

  watch(state.pageReview, async (newValue) => {
    if(newValue && getListReview.value && getDetailProduct.value?.id) {
      try {
        await fetchListReview(getDetailProduct.value?.id,Number(newValue), state.limitReview)
      } catch (error) {
        console.error('list reviews error:', error)
      }
    }
  })

  const paginationReview = computed(() => getListReview.value?.pagination)
  const { handleChangePage, getTotalPages } = usePagination(state.pageReview, computed(() => paginationReview.value?.totalPages ?? 0))

  const getListReviewProduct = computed(() => getListReview.value?.data);

  const variantPrice = computed<number|null>(() => {
    if (!getDetailProduct.value?.variantCombinations.length){
      if(getDetailProduct.value?.priceDiscounts && getDetailProduct.value?.price) {
        if(getDetailProduct.value?.priceDiscounts !== getDetailProduct.value?.price) {
         return getDetailProduct.value?.priceDiscounts
        } else {
         return getDetailProduct.value?.price
        }
      } else {
        return null
      }
    }

    return storeCart.getSelectedVariantPrice(
      getDetailProduct.value.variantCombinations
    )
  })

   const getTotalPoint = computed(() => {
    if (!variantPrice.value) return null

    return storeAccount.calcEarnPoint(variantPrice.value)
  })

  const getVariantGroupsUI = computed(() => {
    if (!getDetailProduct.value?.variantCombinations) return []
    return storeCart.variantGroupsUI(
      getDetailProduct.value.variantCombinations
    )
  })

  const getSelectedStock = computed(() => {
    if (!getDetailProduct.value?.variantCombinations) return 0

    return storeCart.getSelectedVariantStock(
      getDetailProduct.value.variantCombinations
    )
  })

  const getCheckButtonOrder = computed(() => {
    if (getDetailProduct.value?.variantCombinations) {
      if(getSelectedStock.value === 0) return false
      return true
    } else if (getDetailProduct.value?.amount === 0) return false
    else return true
  })

  return {
    ...state,
    ...utils,
    ...operations,
    handleChangePage,
    getDetailProduct,
    getListReviewProduct,
    loadingListRelated,
    loadingListReviews,
    loadingListVoucher,
    loadingDataPromotionGift,
    getVoucherProduct,
    getAvailablePromotionGiftsApi,
    getListProductRelated,
    getTotalPages,
    getTotalPoint,
    variantImages,
    galleryImages,
    variantPrice,
    getVariantGroupsUI,
    getSelectedStock,
    getCheckButtonOrder,
  };
});
