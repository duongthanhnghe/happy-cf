<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes'
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { useFlashSaleDetail } from '@/composables/product/flash-sale/useFlashSaleDetail';
import { useProductsByFlashSaleStore } from '@/stores/client/flash-sale/useProductsByFlashSaleStore';
import { COLUMN } from "@/shared/constants/column"
import { BANNER_LAZY } from '@/const/image';

definePageMeta({
  middleware: ROUTES.PUBLIC.FLASH_SALE.middleware,
  showMembershipCTA: ROUTES.PUBLIC.FLASH_SALE.showMembershipCTA,
})

const route = useRoute()
const slug = route.params.slug as string
const { getFlashSaleDetail, fetchFlashSaleDetail} = useFlashSaleDetail()
const store = useProductsByFlashSaleStore()

const { data, error, pending } = await useAsyncData(
  `flash-sale-detail-${slug}`,
  async () => {
    const data = await fetchFlashSaleDetail(slug)
    return data
  }
)

watch(
  () => getFlashSaleDetail.value?.id,
  async (newValue) => {
    if (!newValue) return
    store.flashSaleId = newValue
    store.fetchInit(newValue)
  },
  { immediate: true }
)
</script>

<template>
  <div :style="`background-color: ${getFlashSaleDetail?.theme.backgroundColor} !important`">
    <div class="container container-xxl pb-section">
      <!-- banner -->
      <div class="overflow-hidden">
        <div class="mt-md overflow-hidden rd-lg" v-for="item in getFlashSaleDetail?.banners" :key="item.id">
          <Image 
            :src="item.src"
            :alt="getFlashSaleDetail?.name"
            class="w-full"
            :width="1800"
            :placeholder="BANNER_LAZY"
          />
        </div>
      </div>
      
      <FlashSaleCount 
        class="pt-md pb-md"
        :startDate="getFlashSaleDetail?.startDate" 
        :endDate="getFlashSaleDetail?.endDate" 
        :color="getFlashSaleDetail?.theme.textColor"
        sizeCountMedium
      />

      <!-- products -->
      <v-infinite-scroll
        v-if="store.getListProductResult && store.getListProductResult.data.length > 0"
        height="auto"
        mode="manual"
        class="overflow-hidden-x"
        @load="store.load"
      >
        <div :class="COLUMN.ROW">
          <template v-for="(item, index) in store.getListProductResult.data" :key="index" >
            <div :class="COLUMN.PRODUCT_XL" >
              <ProductItemTemplate1 :product="item" variant="card"/>
            </div>
          </template>
        </div>
        <div v-if="store.loadingData" class="flex-1 w-full ">
          <SkeletonProductList
            :count="12"
            :row="COLUMN.ROW"
            :column="COLUMN.PRODUCT_XL"
          />
        </div>
        <template #load-more="{ props }">
          <Button color="secondary" label="Xem thêm" @click="props.onClick" />
        </template>
      </v-infinite-scroll>
      </div>
  </div>
  <div class="pb-section"></div>
</template>