import { watch, computed } from "vue";
import { defineStore } from "pinia";
import { useProductDetail } from '@/composables/product/useProductDetail'
import { useProductDetailHandle } from '@/composables/product/useProductDetailHandle'
import { useProductRelated } from '@/composables/product/useProductRelated'
import { useProductReviewByProduct } from '@/composables/product-review/useProductReviewByProduct'
import { usePagination } from '@/utils/paginationHandle'
import { Loading} from '@/utils/global'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useAvailableVouchersForOrder } from "@/composables/voucher/useAvailableVouchers";
import { useProductDetailOperations } from "@/composables/product/useProductDetailOperations";
import { useProductDetailState } from "@/composables/product/useProductDetailState";
import { useAccountStore } from "../users/useAccountStore";

export const useProductDetailStore = defineStore("ProductDetailStore", () => {
  const { getDetailProduct } = useProductDetail()
  const { getListProductRelated, loading: loadingListRelated } = useProductRelated()
  const { getListReview, fetchListReview, loading: loadingListReviews } = useProductReviewByProduct()
  const { getVoucherProduct, loading: loadingListVoucher } = useAvailableVouchersForOrder();
  const storeCart = useCartStore();
  const storeAccount = useAccountStore();

  const state = useProductDetailState();

  const utils = useProductDetailHandle(
    getDetailProduct,
    getListReview,
    state.toggleDescription,
    state.mainSwiper,
    state.thumbsSwiper,
    state.isTogglePopupNote,
    state.isDetailInfoActive,
    state.elScrollInfo,
  )

  const operations = useProductDetailOperations(
    storeCart,
  );

  watch(state.pageReview, async (newValue) => {
    if(newValue && getListReview.value && getDetailProduct.value?.id) {
      Loading(true)
      try {
        await fetchListReview(getDetailProduct.value?.id,Number(newValue), state.limitReview)
      } catch (error) {
        console.error('list reviews error:', error)
      }
      Loading(false)
    }
  })

  const paginationReview = computed(() => getListReview.value?.pagination)
  const { handleChangePage, getTotalPages } = usePagination(state.pageReview, computed(() => paginationReview.value?.totalPages ?? 0))

  const getListReviewProduct = computed(() => getListReview.value?.data);

  const getTotalPoint = computed(() => {
    if (!getDetailProduct.value?.priceDiscounts) {
      return null
    }

    const pointRate = storeAccount.getDetailValue?.membership?.pointRate
    if (!pointRate) {
      return 0
    }

    return Math.round(
      getDetailProduct.value.priceDiscounts * (pointRate / 100)
    )
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
    getVoucherProduct,
    getListProductRelated,
    getTotalPages,
    getTotalPoint,
  };
});
