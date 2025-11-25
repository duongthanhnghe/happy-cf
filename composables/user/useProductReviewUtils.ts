import { type Reactive, type Ref, watch } from 'vue';
import type { ProductReviewPaginationDTO, SubmitProductReviewBody } from '@/server/types/dto/v1/product-review.dto';
import { useProductReviewByUser } from "@/composables/product-review/useProductReviewByUser";
import { useProductReviewDetail } from "@/composables/product-review/useProductReviewDetail";
import { Loading } from '@/utils/global';
import { productReviewAPI } from '@/services/v1/productReview.service';
import { showSuccess, showWarning } from '@/utils/toast';

export const useProductReviewUtils = (
  isTogglePopupSubmit: Ref<boolean>,
  limit: number,
  items: Ref<ProductReviewPaginationDTO|null>,
  statusFilter: Ref<string>,
  defaultForm: SubmitProductReviewBody,
  formDataItem: Reactive<SubmitProductReviewBody>,
  ratingNumber: Ref<number>,
  userId: string,
) => {

  const { getListReview, fetchListReview, loadingData } = useProductReviewByUser()
  const { getDetailReview, fetchDetailReview } = useProductReviewDetail()

  async function load({ done }: { done: (status: 'ok' | 'empty') => void }) {
    if(!items.value || !userId) return
    try {
      const currentPage = items.value.pagination.page
      const totalPages = items.value.pagination.totalPages

      if (currentPage >= totalPages) {
        done('empty')
        return
      }

      const nextPage = currentPage + 1
      await fetchListReview(userId,statusFilter.value, nextPage, limit)

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
    if(!userId) return
    await fetchListReview(userId, statusFilter.value,1, limit)
    if(getListReview.value) items.value = getListReview.value
  }

  watch(() => statusFilter.value, () => {
    items.value = null
    loadingData.value = true
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

  return {
    load,
    getApiListData,
    handleTogglePopupSubmit,
    submitReview,
    handleResetForm,
    loadingData,
  };
};