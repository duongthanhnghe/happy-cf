import { reactive, ref } from "vue";
import type { ProductReviewPaginationDTO, SubmitProductReviewBody } from "@/server/types/dto/v1/product-review.dto";
import { PRODUCT_REVIEW_STATUS } from "@/shared/constants/product-review-status";

export const useProductReviewState = () => {
 
  const isTogglePopupSubmit = ref<boolean>(false);
  const limit = 20
  const items = ref<ProductReviewPaginationDTO|null>(null)
  const statusFilter = ref(PRODUCT_REVIEW_STATUS.pending.status)
  const defaultForm: SubmitProductReviewBody = {
    reviewId: '',
    rating: 0,
    comment: '',
    images: []
  };
  const formDataItem = reactive<SubmitProductReviewBody>({ ...defaultForm })
  const ratingNumber = ref(1)

  return {
    isTogglePopupSubmit,
    limit,
    items,
    statusFilter,
    defaultForm,
    formDataItem,
    ratingNumber,
  };
};
