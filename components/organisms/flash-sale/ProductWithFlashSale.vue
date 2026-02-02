<script lang="ts" setup>
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import type { FlashSaleDTO } from '@/server/types/dto/v1/flash-sale.dto';
import type { ProductDTO } from '@/server/types/dto/v1/product.dto';
import { ROUTES } from '@/shared/constants/routes';
import { ROUTE_HELPERS } from '@/shared/constants/routes-helpers';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay, Thumbs } from 'swiper/modules';

const props = withDefaults(defineProps<{
  listProduct: ProductDTO[],
  loading: boolean,
  flashSaleInfo: FlashSaleDTO,
  linkMoreToMain?: boolean
}>(), {
  loading: true,
  linkMoreToMain: false
})

</script>

<template>
  <div class="rd-xl pd-0 overflow-hidden bg-four" :style="`background-color: ${flashSaleInfo.theme.backgroundColor} !important`">
    <swiper
      v-if="flashSaleInfo.banners.length > 0"
      :modules="[Pagination, Autoplay, Thumbs]"
      :pagination="true"
      :loop="false"
      :auto-height="true"
      :autoplay="{ delay: 5000, disableOnInteraction: false }"
    >
      <swiper-slide
        v-for="(item, index) in flashSaleInfo.banners.slice(0,2)"
        :key="index"
      >
        <Image 
          :src="item.src" 
          :alt="flashSaleInfo.name"
          :width="1800"
        />
      </swiper-slide>
    </swiper>
    <div class="pt-ms pb-ms">
      <div class="position-relative">
        <FlashSaleCount :startDate="flashSaleInfo.startDate" :endDate="flashSaleInfo.endDate" :color="flashSaleInfo.theme.textColor"
          flex
          class="position-absolute right-1"
        />
        <SectionProductListSwiper
          :items="listProduct"
          :loading="loading"
          fullScreen
          :headingText="flashSaleInfo.name || 'Flash sale'"
          :headingColor="flashSaleInfo.theme.textColor"
          variantItem="card"
        />
      </div>
      <div class="text-center mt-ms">
        <NuxtLink :to="props.linkMoreToMain ? ROUTES.PUBLIC.FLASH_SALE.path : ROUTE_HELPERS.flashSaleDetail(flashSaleInfo.slug)">
          <Button color="secondary" label="Xem thêm sản phẩm" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
