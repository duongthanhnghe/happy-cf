<script lang="ts" setup>
import { onMounted } from "vue";
import '@/styles/templates/cart/popup-cart.scss'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { ROUTES } from '@/shared/constants/routes';
import { formatCurrency } from "@/utils/global";
import { useITranslations } from "@/composables/shared/itranslation/useITranslations";
import { useProductMostOrderStore } from "@/stores/client/product/useProductMostOrderStore";
import { COLUMN } from '@/shared/constants/column';
import { POPUP_HEADER_SEARCH } from '@/shared/constants/breakpoints';
import { useProductViewedStore } from "@/stores/client/product/useProductViewedStore";
import { useBaseInformationStore } from "@/stores/client/base-information/useBaseInformationStore";

const { t } = useITranslations()
const store = useCartStore();
const storeAccount = useAccountStore();
const storeProductMostOrder = useProductMostOrderStore()
const storeViewed = useProductViewedStore()
const storeSetting = useBaseInformationStore();

onMounted(async() => {
  if(store.cartListItem.length === 0) store.syncCartCookie();
  if(!storeAccount.getPendingReward && storeAccount.getUserId){
    await storeAccount.fetchPendingRewardPoints(storeAccount.getUserId)
  } 
});
</script>
<template>

<Popup
    popupId="popup-cart" 
    v-model="store.isTogglePopup" 
    :popupHeading="t('cart.text1').text" 
    bodyClass="bg-gray6 popup-cart-body" 
    footerFixed 
    align="right"
  >
  <template #header v-if="store.getCartListItem && store.getCartListItem.length > 0">
    <Button icon="remove_shopping_cart" color="secondary" @handleOnClick="store.handleDeleteCartAll" />
  </template>

  <template #body>
    <template v-if="store.getCartListItem && store.getCartListItem.length > 0">
      <div class="flex flex-direction-column gap-sm">
        <CartItemTemplate1 v-for="(item, index) in store.getCartListItem" :key="index" :item="item" />
      </div>

      <template v-if="store.getTotalPriceDiscount != 0">
        <CartPointInfoLabel :getTotalPoint="store.getTotalPoint" :userId="storeAccount.getUserId" />
      </template>
    
      <Text color="gray5" textClass="mt-sm flex gap-xs justify-end align-baseline">
        <Text text="Tạm tính:"/>
        <Text color="black" size="md" weight="semibold" :text="`${formatCurrency(store.getTotalPriceCurrent - store.getOrderPriceDiscount)}`"/>
        <Text :text="`(${store.getCartCount} sản phẩm)`"/>
      </Text>
    </template>
    <div v-else>
      <div class="text-center">
        <NoData :text="t('cart.text19').text" class="mb-ms"/>
        <NuxtLink :to="{ path: ROUTES.PUBLIC.ORDER.path }" @click="store.isTogglePopup = false">
          <Button tag="div" :label="t('cart.text20').text" color="primary" />
        </NuxtLink>
      </div>
      <SectionProductListSwiper 
        :items="storeProductMostOrder.getListProductMostOrder?.data" 
        :loading="storeProductMostOrder.loadingData" 
        :breakpoints="POPUP_HEADER_SEARCH" 
        :headingText="t('product.section.text2')" 
        headingSize="lg"
        class="mt-md pb-mt"
        :skCount="3"
        :skColumn="COLUMN.PRODUCT_LG"
      />

      <SectionProductListSwiper 
        v-if="storeViewed.listItems && storeViewed.listItems.length > 0" 
        :items="storeViewed.listItems" 
        :loading="storeViewed.loading"
        :breakpoints="POPUP_HEADER_SEARCH"
        :headingText="t('product.section.text1')"
        headingSize="lg"
        class="pt-md"
      />
    </div>
  </template>
  <template #footer>
    <template v-if="store.getCartListItem && store.getCartListItem.length > 0">
      <div v-if="storeSetting.getConfigShipping?.enabled" class="flex gap-xs mb-xs">
        <MaterialIcon
          name="delivery_truck_speed"
          color="gray5"
          weight="light"
        />
        <Text :text="storeSetting.getShippingTooltip" size="xs" />
      </div>
      <NuxtLink :to="{ path: ROUTES.PUBLIC.CART.path }" @click="store.isTogglePopup = false">
        <Button tag="div" :label="t('cart.text11').text" color="primary" class="w-full" />
      </NuxtLink>
    </template>
  </template>
</Popup>

</template>