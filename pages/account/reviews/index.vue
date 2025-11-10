<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes';
import { useProductReviewByUserStore } from '@/stores/client/product-review/useProductReviewByUserStore';

definePageMeta({
  layout: ROUTES.PUBLIC.ACCOUNT.layout,
  headerTypeLeft: ROUTES.PUBLIC.ACCOUNT.headerTypeLeft,
  middleware: ROUTES.PUBLIC.ACCOUNT.middleware,
})

const store = useProductReviewByUserStore();

if(!store.getItems) await store.getApiListData()

</script>
<template>
  <ListProductReview />

  <PopupProductReviewSubmit />
</template>