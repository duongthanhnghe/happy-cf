<script lang="ts" setup>
import { ref, watch, onMounted } from "vue"
import { ROUTES } from '@/shared/constants/routes'
import { useProductDetailStore } from '@/stores/client/product/useProductDetailStore'
import { useAvailableVouchersForOrder } from "@/composables/voucher/useAvailableVouchers";
import { useAccountStore } from "@/stores/client/users/useAccountStore";
import type { ProductDTO } from "@/server/types/dto/v1/product.dto";

definePageMeta({
  middleware: ROUTES.PUBLIC.PRODUCT.children?.DETAIL.middleware ?? { middleware: ['product-detail'] },
})

const store = useProductDetailStore()
const storeAccount = useAccountStore()
const valueChangePage = ref<boolean|null>(null)
const detail: ProductDTO | null = store.getDetail
const breakpoints = {
  320: { slidesPerView: 2.3, spaceBetween: 10 },
  640: { slidesPerView: 3, spaceBetween: 10 },
  1024: { slidesPerView: 3, spaceBetween: 10 },
  1200: { slidesPerView: 4, spaceBetween: 24 }
}
const { fetchAvailableVouchers, getVoucherProduct, loading: loadingListVoucher } = useAvailableVouchersForOrder();

watch(valueChangePage, (newVal) => {
  if(newVal !== null) store.handleChangePage(newVal)
  valueChangePage.value = null
})

onMounted(async () => {
  if(!detail) return
  
  const userId = storeAccount.getUserId || '';
  const categoryIds = detail.categoryId ? [detail.categoryId] : [];
  const orderTotal = detail.priceDiscounts;

  if(categoryIds && orderTotal){
    await fetchAvailableVouchers({
      userId,
      categoryIds,
      orderTotal
    })
  }
})
    
</script>

<template>
  <div v-if="detail" class="container pt-section pb-section" >
    <ProductDetail />

    <ListVoucherByProduct :items="getVoucherProduct" :loading="loadingListVoucher" />

    <ListProductRelated :items="store.getListItems" :loading="store.loadingListRelated" :breakpoints="breakpoints" headingText="Gợi ý lien quan" />

    <ListReviewByProduct :items="store.getListReviewProduct" :loading="store.loadingListReviews" />
    <div v-if="store.getTotalPages && store.getTotalPages.length > 1" class="flex gap-sm justify-end">
      <Pagination :totalPages="store.getTotalPages" v-model:page="store.pageReview" v-model:valueChangePage="valueChangePage" />
    </div>
  </div>
  <NoData v-else />
</template>