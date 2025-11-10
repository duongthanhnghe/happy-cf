<script lang="ts" setup>
import { useWishlistStore } from '@/stores/client/users/useWishlistStore';
const store = useWishlistStore();
</script>
<template>
  <LoadingData v-if="store.loadingData && store.getItems === null"/>
  <div v-else-if="store.getItems && store.getItems.length > 0" class="row row-xs">
    <div v-for="item in store.getItems" :key="item.id"  class="col-6 col-md-4 mb-sm">
        <ProductItemWishlistTemplate :product="item.product"/>
    </div>
  </div>
  <NoData v-else />
</template>
