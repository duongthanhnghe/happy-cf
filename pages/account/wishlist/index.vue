<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes';
import { useWishlistStore } from '@/stores/client/users/useWishlistStore';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import { COLUMN } from '@/shared/constants/column';

definePageMeta({
  layout: ROUTES.PUBLIC.ACCOUNT.layout,
  headerTypeLeft: ROUTES.PUBLIC.ACCOUNT.headerTypeLeft,
  middleware: ROUTES.PUBLIC.ACCOUNT.middleware,
})

const storeDisplay = useDisplayStore()
const store = useWishlistStore();

if(!store.getItems) await store.loadItems()
</script>
<template>
  <Card size="md" :bg="storeDisplay.isMobileTable ? 'gray6':'white'" :heading="ROUTES.PUBLIC.ACCOUNT.children?.WISHLIST.label" :class="storeDisplay.isMobileTable ? 'pd-0':'rd-xl'">
    <SectionProductListColumn
      :items="store.getItems?.map(item => item.product)"
      :loading="store.loadingData" 
      :column="COLUMN.PRODUCT"
      :variant="storeDisplay.isMobileTable ? 'card':''"
    />
  </Card>
</template>