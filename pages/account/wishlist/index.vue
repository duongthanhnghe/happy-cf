<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes';
import { useWishlistStore } from '@/stores/client/users/useWishlistStore';

definePageMeta({
  layout: ROUTES.PUBLIC.ACCOUNT.layout,
  headerTypeLeft: ROUTES.PUBLIC.ACCOUNT.headerTypeLeft,
  middleware: ROUTES.PUBLIC.ACCOUNT.middleware,
})

const store = useWishlistStore();

if(!store.getItems) await store.loadItems()
</script>
<template>
  <ListWishlist />
</template>