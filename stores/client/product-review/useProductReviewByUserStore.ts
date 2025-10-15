import { ref, computed, reactive, watch } from "vue";
import { defineStore } from "pinia";
import type { ProductReviewPaginationDTO, SubmitProductReviewBody, ProductReviewDTO } from '@/server/types/dto/v1/product-review.dto'
import { useProductReviewByUser } from "@/composables/product-review/useProductReviewByUser";
import { useProductReviewDetail } from "@/composables/product-review/useProductReviewDetail";
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { PRODUCT_REVIEW_STATUS } from '@/shared/constants/product-review-status'
import {
  Loading
} from '@/utils/global'
import { showSuccess, showWarning } from "@/utils/toast";
import { productReviewAPI } from "@/services/v1/productReview.service";

export const useProductReviewByUserStore = defineStore("ProductReviewByUserStore", () => {

const { getListReview, fetchListReview } = useProductReviewByUser()
const { getDetailReview, fetchDetailReview } = useProductReviewDetail()
const storeAccount = useAccountStore();

//state
const isTogglePopup = ref<boolean>(false);
const isTogglePopupSubmit = ref<boolean>(false);
const limit = 1
const items = ref<ProductReviewPaginationDTO|null>(null)
const statusFilter = ref(PRODUCT_REVIEW_STATUS.pending.status)
const formDataItem = reactive<SubmitProductReviewBody>({
  reviewId: '',
  rating: 0,
  comment: '',
  images: []
});
const ratingNumber = ref(1)

const handleTogglePopup = (value: boolean) => {
  isTogglePopup.value = value;
  getApiListProduct()
};

async function load({ done }: { done: (status: 'ok' | 'empty') => void }) {
  if(!items.value) return
  try {
    const currentPage = items.value.pagination.page
    const totalPages = items.value.pagination.totalPages

    if (currentPage >= totalPages) {
      done('empty')
      return
    }

    const nextPage = currentPage + 1
    await fetchListReview(storeAccount.getDetailValue?.id,statusFilter.value, nextPage, limit)

    if (getListReview.value && getListReview.value.data && getListReview.value.data.length > 0) {
      items.value.data.push(...getListReview.value.data)
      items.value.pagination = getListReview.value.pagination
      done('ok')
    } else {
      done('empty')
    }
  } catch (err) {
    console.error('Error loading more products:', err)
    done('empty')
  }
}

const getApiListProduct = async () => {
  await fetchListReview(storeAccount.getDetailValue?.id, statusFilter.value,1, limit)
  if(getListReview.value) items.value = getListReview.value
}

watch(() => statusFilter.value, (newValue) => {
  items.value = null
  getApiListProduct()
})

const handleTogglePopupSubmit = (value: boolean, reviewId: string) => {
  isTogglePopupSubmit.value = value;
  fetchDetailReview(reviewId)
};

async function submitReview() {
  Loading(true);
  try {
    if(!getDetailReview.value?.id) return
    formDataItem.reviewId = getDetailReview.value?.id
    formDataItem.rating = ratingNumber.value

    const newDataItem = {...formDataItem}
    const data = await productReviewAPI.submitReview(newDataItem)
    if(data.code === 0){
      showSuccess('Tao thanh cong')
      getApiListProduct()
      isTogglePopupSubmit.value = false;
      handleResetForm()
    } else {
      showWarning('Tao that bai')
    }
    Loading(false);
  } catch (err) {
    console.error('Error submitting form:', err)
  }
  Loading(false);
}

const handleResetForm = () => {
  formDataItem.reviewId = '',
  formDataItem.rating = 0,
  formDataItem.comment = '',
  formDataItem.images = []
}

  //getters
  const getItems = computed(() => items.value?.data)
  const getDetailItem = computed(() => getDetailReview.value)

  return {
    // state
    items,
    isTogglePopup,
    isTogglePopupSubmit,
    formDataItem,
    ratingNumber,
    statusFilter,
    // actions
    handleTogglePopup,
    getApiListProduct,
    load,
    submitReview,
    handleTogglePopupSubmit,
    //getters
    getItems,
    getDetailItem,
  };
});
