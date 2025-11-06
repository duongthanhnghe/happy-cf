<script lang="ts" setup>
import { onMounted } from "vue";
import '@/styles/templates/cart/popup-cart.scss'
import { formatCurrency } from '@/utils/global'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { ROUTES } from '@/shared/constants/routes';

const store = useCartStore();
const storeDisplay = useDisplayStore()
const storeAccount = useAccountStore();

onMounted(() => {
    store.syncCartCookie();
});
</script>
<template>

<Popup popupId="popup-cart" v-model="store.isTogglePopup" popupHeading="Gio hang" bodyClass="bg-gray2 popup-cart-body" align="right">
  <template #header v-if="store.getCartListItem && store.getCartListItem.length > 0">
    <Button label="Huy" :color="!storeDisplay.isMobileTable ? 'gray':'blur'" :size="!storeDisplay.isMobileTable ? 'md':'sm'" @handleOnClick="store.handleDeleteCartAll" />
  </template>

  <template #body>
    <div v-if="store.getCartListItem && store.getCartListItem.length > 0">
      <div class="rd-lg overflow-hidden">
        <CartItemTemplate1 v-for="(item, index) in store.getCartListItem" :key="index" :item="item" />
      </div>

      <div v-if="store.getTotalPriceDiscount != 0 && storeAccount.getDetailValue?.id" class="card-sm bg-white flex justify-between mt-ms">
        Tang diem tuy lich
        <span class="flex gap-xs weight-semibold">
          <Button tag="span" size="xs" color="secondary" icon="diamond_shine"/>
          {{ store.getTotalPoint }}
        </span>
      </div>

      <div class="portal-popup-footer">
        <NuxtLink :to="{ path: ROUTES.PUBLIC.CART.path }" @click="store.isTogglePopup = false">
          <Button tag="div" label="Dat hang" color="primary" class="w-full" />
        </NuxtLink>
      </div>
    </div>
    <div v-else>
      <NoData />
    </div>
  </template>
</Popup>

</template>