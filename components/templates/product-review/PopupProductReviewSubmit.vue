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
  popupHeading="Danh gia" 
  align="right"
  bodyClass="bg-gray6"
  footerFixed
  >
  <template #body>
    <Card size="xs" class="rd-lg flex gap-sm align-center mb-ms shadow-1">
      <div class="bg-gray2 rd-md">
        <img v-if="store.getDetailReview?.productId.image" :src="store.getDetailReview?.productId.image" width="60" />
      </div>
      <Text :text="store.getDetailReview?.productId.productName" color="black" weight="semibold"/>
    </Card>
    <v-form ref="formRef" validate-on="submit lazy" @submit.prevent="handleSubmitCreate">
      <LabelInput label="So sao" required/>
      <v-rating
        v-model="store.ratingNumber"
        :item-labels="['Kem', 'Tam on', 'Binh thuong', 'Tot', 'Tuyet voi']"
        class="mb-sm v-rating-control w-full"
        item-label-position="bottom"
        active-color="orange"
        hide-details
      ></v-rating>

      <LabelInput label="Noi dung" required/>
      <v-textarea v-model="store.formDataItem.comment" :rules="nullRules" label="Nhap ten danh muc" variant="outlined" required></v-textarea>
    </v-form>
  </template>

  <template #footer>
    <Button @click="handleSubmitCreate" color="primary" label="Gui danh gia" class="w-full" />
  </template>
</Popup>
</template>
