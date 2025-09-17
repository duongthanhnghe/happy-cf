<script lang="ts" setup>
import {
  useWishlistStore
} from '@/stores/users/useWishlistStore';

const store = useWishlistStore();

</script>
<template>
  <Popup popupId="popup-wishlist" v-model="store.isTogglePopupAdd" popupHeading="San pham yeu thich" align="right">
    <template #body>
      <div class="row row-sm">
        <div v-if="store.getListOrders" v-for="item in store.getListOrders" :key="item.id"  class="col-6 col-md-4 mb-sm">
            <ProductItemWishlistTemplate :product="item.product"/>
        </div>
        <div v-else>
          <NoData />
        </div>
      </div>
    </template>
  </Popup>
</template>
