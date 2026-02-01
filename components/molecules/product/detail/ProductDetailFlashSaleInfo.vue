<script lang="ts" setup>
import type { FlashSaleDTO } from '@/server/types/dto/v1/flash-sale.dto';

const props = withDefaults(defineProps<{
  getFlashSaleDetail: FlashSaleDTO
}>(), {
  // loading: true,
})

</script>

<template>
  <div v-if="getFlashSaleDetail" class="rd-lg pd-0 overflow-hidden mt-sm" :style="`background-color: ${getFlashSaleDetail.theme.backgroundColor} !important`">
    <Image 
      :src="getFlashSaleDetail.banners[0].src"
      :alt="getFlashSaleDetail.name"
      class="w-full"
      :width="1800"
    />
    <div class="pd-ms">
      <div class="flex align-center flex-wrap justify-between">
        <FlashSaleCount :startDate="getFlashSaleDetail.startDate" :endDate="getFlashSaleDetail.endDate" :color="getFlashSaleDetail.theme.textColor" class="order-2"/>
        <slot />
      </div>
      <Card bg="white" class="rd-md mt-sm">
        <Text :text="getFlashSaleDetail.name" color="black" weight="semibold" size="normal" />
        <Text v-if="getFlashSaleDetail.description" :text="getFlashSaleDetail.description" class="white-space-pre line-height-1d8" />
      </Card>
    </div>
  </div>
</template>
