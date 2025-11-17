<script lang="ts" setup>
import { onMounted } from "vue";
import '@/styles/templates/cart/popup-cart.scss'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { ROUTES } from '@/shared/constants/routes';
import { formatCurrency } from "@/utils/global";

const store = useCartStore();
const storeDisplay = useDisplayStore()
const storeAccount = useAccountStore();

onMounted(() => {
    store.syncCartCookie();
});
</script>
<template>

<Popup popupId="popup-cart" v-model="store.isTogglePopup" popupHeading="Gio hang" bodyClass="bg-gray6 popup-cart-body" footerFixed align="right">
  <template #header v-if="store.getCartListItem && store.getCartListItem.length > 0">
    <Button icon="remove_shopping_cart" color="secondary" @handleOnClick="store.handleDeleteCartAll" />
  </template>

  <template #body>
    <template v-if="store.getCartListItem && store.getCartListItem.length > 0">
      <div class="flex flex-direction-column gap-sm">
        <CartItemTemplate1 v-for="(item, index) in store.getCartListItem" :key="index" :item="item" />
      </div>

      <div v-if="store.getTotalPriceDiscount != 0 && storeAccount.getDetailValue?.id" class="card-sm bg-white flex justify-between mt-ms">
        Tang diem tuy lich
        <span class="flex gap-xs weight-semibold">
          <Button tag="span" size="xs" color="secondary" icon="diamond_shine"/>
          {{ store.getTotalPoint }}
        </span>
      </div>
      <Text color="gray5" textClass="mt-sm flex gap-xs justify-end align-baseline">
        <Text text="Tam tinh:"/>
        <Text color="black" size="md" weight="semibold" :text="`${formatCurrency(store.getTotalPriceCurrent - store.getOrderPriceDiscount)}`"/>
        <Text :text="`(${store.getCartCount} san pham)`"/>
      </Text>
    </template>
    <div v-else>
      <NoData />
    </div>
  </template>
  <template #footer v-if="store.getCartListItem && store.getCartListItem.length > 0">
    <NuxtLink :to="{ path: ROUTES.PUBLIC.CART.path }" @click="store.isTogglePopup = false">
      <Button tag="div" label="Dat hang" color="primary" class="w-full" />
    </NuxtLink>
  </template>
</Popup>

</template>