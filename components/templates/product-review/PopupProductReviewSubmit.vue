<script lang="ts" setup>
import { useProductReviewByUserStore } from '@/stores/client/product-review/useProductReviewByUserStore';
import { nullRules } from '@/utils/validation';
import type { VForm } from 'vuetify/lib/components';
import { ref } from 'vue';

const store = useProductReviewByUserStore();
const formRef = ref<VForm | null>(null);

const handleSubmitCreate = async () => {
  if (!formRef.value) return;
  const { valid } = await formRef.value.validate();
  if (!valid) return;
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
          <img v-if="store.getDetailReview?.productId.image" :src="store.getDetailReview?.productId.image" width="60" />
        </div>
        <Text :text="store.getDetailReview?.productId.productName" color="black" weight="semibold"/>
      </Card>
      <v-form ref="formRef" validate-on="submit lazy" @submit.prevent="handleSubmitCreate">
        <LabelInput label="Số sao" required/>
        <v-rating
          v-model="store.ratingNumber"
          :item-labels="['Kém', 'Tạm ổn', 'Bình thường', 'Tốt', 'Tuyệt vời']"
          class="mb-sm v-rating-control w-full"
          item-label-position="bottom"
          active-color="orange"
          hide-details
        ></v-rating>

        <LabelInput label="Nội dung" required/>
        <v-textarea v-model="store.formDataItem.comment" :rules="nullRules" label="Nhập nội dung" variant="outlined" required></v-textarea>
      </v-form>
    </div>
  </template>

  <template #footer>
    <Button @click="handleSubmitCreate" color="primary" label="Gửi đánh giá" class="w-full" />
  </template>
</Popup>
</template>
