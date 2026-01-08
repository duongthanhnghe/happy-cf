<script lang="ts" setup>
import { useValidate } from '@/composables/validate/useValidate'
import { createProductReviewSchema } from '@/shared/validate/schemas/product-review.schema'
import { useProductReviewByUserStore } from '@/stores/client/product-review/useProductReviewByUserStore';
import { showWarning } from '@/utils/toast'

const { validate, formErrors } = useValidate(createProductReviewSchema)

const store = useProductReviewByUserStore();

const handleSubmitCreate = async () => {
  const payload = {
    reviewId: store.getDetailReview?.id,
    rating: store.ratingNumber,
    comment: store.formDataItem.comment,
  }

  if (!validate(payload)) {
    showWarning('Vui lòng kiểm tra lại đánh giá')
    return
  }

  await store.submitReview();
}

</script>
<template>
<Popup 
  v-model="store.isTogglePopupSubmit" 
  popupHeading="Đánh giá" 
  align="right"
  bodyClass="bg-gray6"
  footerFixed
  >
  <template #body>
    <div class="overflow-hidden">
      <Card size="xs" class="rd-lg flex gap-sm align-center mb-ms shadow-1">
        <div class="bg-gray2 rd-md">
          <Image 
            v-if="store.getDetailReview?.productId.image"
            :src="store.getDetailReview?.productId.image"
            :alt="store.getDetailReview?.productId.productName"
            :width="60"
            class="rd-md"
            preset="label"
          />
        </div>
        <Text :text="store.getDetailReview?.productId.productName" color="black" weight="semibold"/>
      </Card>
      <v-form @submit.prevent="handleSubmitCreate">
        <LabelInput label="Số sao" required/>
        <v-rating
          v-model="store.ratingNumber"
          :item-labels="['Kém', 'Tạm ổn', 'Bình thường', 'Tốt', 'Tuyệt vời']"
          class="mb-sm v-rating-control w-full"
          item-label-position="bottom"
          active-color="orange"
          hide-details
          :error="!!formErrors.rating"
        ></v-rating>

        <LabelInput label="Nội dung" required/>
        <v-textarea v-model="store.formDataItem.comment" :error="!!formErrors.comment"
        :error-messages="formErrors.comment" label="Nhập nội dung" variant="outlined" required></v-textarea>
      </v-form>
    </div>
  </template>

  <template #footer>
    <Button @click="handleSubmitCreate" color="primary" label="Gửi đánh giá" class="w-full" />
  </template>
</Popup>
</template>
