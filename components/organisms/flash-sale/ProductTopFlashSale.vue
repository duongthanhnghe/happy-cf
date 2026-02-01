<script lang="ts" setup>
import type { FlashSaleDTO } from '@/server/types/dto/v1/flash-sale.dto';
import type { ProductDTO } from '@/server/types/dto/v1/product.dto';

const props = withDefaults(defineProps<{
  getTopFlashSaleProducts: ProductDTO[],
  loading: boolean,
  getTopPriority: FlashSaleDTO
}>(), {
  // loading: true,
})


</script>

<template>
  <div class="rd-xl pd-0 overflow-hidden" :style="`background-color: ${getTopPriority.theme.backgroundColor} !important`">
    <Image 
      :src="getTopPriority.banners[0].src"
      :alt="getTopPriority.name"
      class="w-full"
      :width="1800"
    />
    <div class="pt-ms pb-ms">
      <div class="position-relative">
        <FlashSaleCount :startDate="getTopPriority.startDate" :endDate="getTopPriority.endDate" :color="getTopPriority.theme.textColor"
          flex
          class="position-absolute right-1"
        />
        <SectionProductListSwiper
          :items="getTopFlashSaleProducts"
          :loading="loading"
          fullScreen
          :headingText="getTopPriority.name || 'Flash sale'"
          :headingColor="getTopPriority.theme.textColor"
          variantItem="card"
        />
      </div>
    </div>
  </div>
</template>
