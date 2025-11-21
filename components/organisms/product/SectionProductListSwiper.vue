<script lang="ts" setup>
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Autoplay } from 'swiper/modules';
import type { ProductDTO } from '@/server/types/dto/v1/product.dto'
import type { SwiperOptions } from 'swiper/types';

const storeDisplay = useDisplayStore()

const props = withDefaults(defineProps<{
  items?: ProductDTO[]
  loading?: boolean
  headingText?: string
  backgroundItem?: string
  breakpoints?: SwiperOptions['breakpoints']
}>(), {
  items: () => [],
  loading: false,
})

const breakpointsDefault = {
  320: { slidesPerView: 2.3, spaceBetween: 10 },
  640: { slidesPerView: 3, spaceBetween: 10 },
  1024: { slidesPerView: 3, spaceBetween: 10 },
  1200: { slidesPerView: 4, spaceBetween: 16 },
  1400: { slidesPerView: 5, spaceBetween: 16 },
  1920: { slidesPerView: 6, spaceBetween: 16 },
}

</script>

<template>
  <div>
    <div :class="`container container-xxl`">
      <LoadingData v-if="props.loading" />
      <template v-else>
        <Heading v-if="props.headingText" tag="h2" size="lg" weight="semibold" class="black mb-sm">
          {{ props.headingText }}
        </Heading>
        <client-only>
          <swiper :modules="[Navigation, Autoplay]" :breakpoints='props.breakpoints ? props.breakpoints : breakpointsDefault' :space-between="10" :navigation="storeDisplay.isMobileTable ? false:true" :autoplay="{ delay: 5000, disableOnInteraction: false }" class="mySwiper">
            <swiper-slide v-for="(product, index) in props.items" :key="index">
              <ProductItemTemplate1 :product="product" :background="props.backgroundItem" />
            </swiper-slide>
          </swiper>
        </client-only>
      </template>
    </div>
  </div>
</template>
