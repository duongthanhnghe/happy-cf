<script lang="ts" setup>
import type { SubmitEventPromise } from 'vuetify';
import { useProductReviewByUserStore } from '@/stores/client/product-review/useProductReviewByUserStore';
import { nullRules } from '@/utils/validation';

const store = useProductReviewByUserStore();

const handleSubmitCreate = async (event: SubmitEventPromise) => {
  const results = await event
  if (!results.valid) return
  await store.submitReview();
}

</script>
<template>
<Popup children popupId="popup-product-review-submit" v-model="store.isTogglePopupSubmit"  popupHeading="Danh gia" align="right">
  <template #body>
    <v-form validate-on="submit lazy" @submit.prevent="handleSubmitCreate">
      <div class="portal-popup-footer">
        <Button type="submit" color="primary" label="Gui danh gia" class="w-full" />
      </div>
      {{ store.getDetailItem?.productId.image }}
      {{ store.getDetailItem?.productId.productName }}
      <v-rating
        v-model="store.ratingNumber"
        :item-labels="['Kem', 'Tam on', 'Binh thuong', 'Tot', 'Tuyet voi']"
        class="mb-sm"
        item-label-position="bottom"
        hide-details
      ></v-rating>

      <LabelInput label="Noi dung" required/>
      <v-textarea v-model="store.formDataItem.comment" :rules="nullRules" label="Nhap ten danh muc" variant="outlined" required></v-textarea>
    </v-form>
  </template>
</Popup>
</template>
