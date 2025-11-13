import { computed } from "vue";
import { defineStore } from "pinia";
import { useProductReviewDetail } from "@/composables/product-review/useProductReviewDetail";
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { useProductReviewUtils } from "@/composables/user/useProductReviewUtils";
import { useProductReviewState } from "@/composables/user/useProductReviewState";

export const useProductReviewByUserStore = defineStore("ProductReviewByUserStore", () => {

  const { getDetailReview } = useProductReviewDetail()
  const storeAccount = useAccountStore();

  const state = useProductReviewState();

  const utils = useProductReviewUtils(
    state.isTogglePopupSubmit,
    state.limit,
    state.items,
    state.statusFilter,
    state.defaultForm,
    state.formDataItem,
    state.ratingNumber,
    state.loadingData,
    storeAccount.getUserId
  );

  const getItems = computed(() => state.items.value?.data)
  const getDetailItem = computed(() => getDetailReview.value)

  return {
    ...state,
    ...utils,
    getItems,
    getDetailItem,
  };
});
