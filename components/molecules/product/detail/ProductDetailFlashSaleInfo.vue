<script lang="ts" setup>
import type { FlashSaleDTO } from '@/server/types/dto/v1/flash-sale.dto';
import { ROUTE_HELPERS } from '@/shared/constants/routes-helpers';
import { BANNER_LAZY } from '@/const/image';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';

const storeDisplay = useDisplayStore();
const props = withDefaults(defineProps<{
  getFlashSaleDetail: FlashSaleDTO
}>(), {
  
})

</script>

<template>
  <div v-if="getFlashSaleDetail" class="rd-lg pd-0 overflow-hidden mt-sm" :style="`background-color: ${getFlashSaleDetail.theme.backgroundColor} !important`">
    <Image 
      :src="getFlashSaleDetail.banners[0].src"
      :alt="getFlashSaleDetail.name"
      class="w-full"
      :width="800"
      :placeholder="BANNER_LAZY"
    />
    <div class="pd-ms">
      <div class="flex align-center flex-wrap justify-between gap-sm">
        <FlashSaleCount :startDate="getFlashSaleDetail.startDate" :endDate="getFlashSaleDetail.endDate" :color="getFlashSaleDetail.theme.textColor" :class="[storeDisplay.isLaptop ? 'order-2':'flex-1 min-width-full']"/>
        <slot />
      </div>
      <Card bg="white" class="rd-md mt-sm">
        <Text :text="getFlashSaleDetail.name" color="black" weight="semibold" size="normal" />
        <Text v-if="getFlashSaleDetail.description" :text="getFlashSaleDetail.description" class="white-space-pre line-height-1d8" />
        <NuxtLink :to="ROUTE_HELPERS.flashSaleDetail(getFlashSaleDetail.slug)">
          <Text text="Xem thêm" color="gray5" class="text-underline hover-color-primary" />
        </NuxtLink>
      </Card>
    </div>
  </div>
</template>
