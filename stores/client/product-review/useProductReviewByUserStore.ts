import { ref, computed, reactive, watch } from "vue";
import { defineStore } from "pinia";
import { useProductReviewByUser } from "@/composables/product-review/useProductReviewByUser";
import { useProductReviewDetail } from "@/composables/product-review/useProductReviewDetail";
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { PRODUCT_REVIEW_STATUS } from '@/shared/constants/product-review-status'
import { Loading } from '@/utils/global'
import { showSuccess, showWarning } from "@/utils/toast";
import { productReviewAPI } from "@/services/v1/productReview.service";
import type { ProductReviewPaginationDTO, SubmitProductReviewBody } from '@/server/types/dto/v1/product-review.dto'

export const useProductReviewByUserStore = defineStore("ProductReviewByUserStore", () => {

  const { getListReview, fetchListReview } = useProductReviewByUser()
  const { getDetailReview, fetchDetailReview } = useProductReviewDetail()
  const storeAccount = useAccountStore();

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
  const loadingData = ref<boolean>(false);

  async function load({ done }: { done: (status: 'ok' | 'empty') => void }) {
    if(!items.value || !storeAccount.getUserId) return
    try {
      const currentPage = items.value.pagination.page
      const totalPages = items.value.pagination.totalPages

      if (currentPage >= totalPages) {
        done('empty')
        return
      }

      const nextPage = currentPage + 1
      await fetchListReview(storeAccount.getUserId,statusFilter.value, nextPage, limit)

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

  const getApiListData = async () => {
    if(!storeAccount.getUserId) return
    loadingData.value = true
    await fetchListReview(storeAccount.getUserId, statusFilter.value,1, limit)
    if(getListReview.value) items.value = getListReview.value
    loadingData.value = false
  }

  watch(() => statusFilter.value, () => {
    items.value = null
    getApiListData()
  })

  const handleTogglePopupSubmit = (value: boolean, reviewId: string) => {
    isTogglePopupSubmit.value = value;
    handleResetForm()
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
        getApiListData()
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
    Object.assign(formDataItem, defaultForm)
  }

  const getItems = computed(() => items.value?.data)
  const getDetailItem = computed(() => getDetailReview.value)

  return {
    loadingData,
    isTogglePopupSubmit,
    formDataItem,
    ratingNumber,
    statusFilter,
    getApiListData,
    load,
    submitReview,
    handleTogglePopupSubmit,
    getItems,
    getDetailItem,
  };
});
