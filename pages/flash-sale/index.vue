<script lang="ts" setup>
import { useAllFlashSalesWithProducts } from '@/composables/product/flash-sale/useAllFlashSalesWithProducts';
import { ROUTES } from '@/shared/constants/routes';

definePageMeta({
  middleware: ROUTES.PUBLIC.FLASH_SALE.middleware,
  headerTypeLeft: ROUTES.PUBLIC.FLASH_SALE.headerTypeLeft,
  layout: ROUTES.PUBLIC.FLASH_SALE.layout,
  showMembershipCTA: ROUTES.PUBLIC.FLASH_SALE.showMembershipCTA,
  showBreadcrumb: ROUTES.PUBLIC.FLASH_SALE.showBreadcrumb,
})

const {
  fetchAllFlashSalesWithProducts,
  getAllFlashSalesWithProducts,
  loadingData
} = useAllFlashSalesWithProducts()

if (!getAllFlashSalesWithProducts.value || getAllFlashSalesWithProducts.value.length === 0) await fetchAllFlashSalesWithProducts()

</script>

<template>
  <div v-if="getAllFlashSalesWithProducts.length > 0" class="container container-xxl pb-section">
    <div v-for="fs in getAllFlashSalesWithProducts" :key="fs.flashSale.id" class="pt-section">
      <ProductWithFlashSale 
        :flashSaleInfo="fs.flashSale" 
        :listProduct="fs.products"
        :loading="loadingData"
      />
    </div>
  </div>
</template>
