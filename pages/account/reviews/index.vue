<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes';
import { useProductReviewByUserStore } from '@/stores/client/product-review/useProductReviewByUserStore';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';

definePageMeta({
  layout: ROUTES.PUBLIC.ACCOUNT.layout,
  middleware: ROUTES.PUBLIC.ACCOUNT.middleware,
  showHeaderSub: ROUTES.PUBLIC.ACCOUNT.showHeaderSub,
})

const storeDisplay = useDisplayStore()
const store = useProductReviewByUserStore();

if (!store.getItems || store.getItems.length === 0) await store.getApiListData()
</script>
<template>
  <Card size="md" :bg="storeDisplay.isMobileTable ? 'gray6':'white'" :heading="ROUTES.PUBLIC.ACCOUNT.children?.REVIEWS.label" :class="storeDisplay.isMobileTable ? 'pd-0':'rd-xl'">
    <ListProductReview />
  </Card>

  <PopupProductReviewSubmit />
</template>