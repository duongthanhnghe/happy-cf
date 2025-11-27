<script lang="ts" setup>
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/grid';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Grid } from 'swiper/modules';
import { PRODUCT_CATEGORY_ALL } from '@/shared/constants/breakpoints';
import type { CategoryProductDTO } from '@/server/types/dto/v1/product.dto'

const props = withDefaults(defineProps<{
  items: CategoryProductDTO[]
  loading?: boolean
  heading?: string
}>(), {
  items: () => [],
})
</script>

<template>
  <LoadingData v-if="props.loading && !items" />
  <template v-else-if="items.length > 0">
    <Heading v-if="props.heading" tag="h2" size="lg" weight="semibold" class="black mb-xs pl-ms pr-ms">
      {{ props.heading }}
    </Heading>
    <client-only>
      <swiper :modules="[Autoplay, Grid]" :breakpoints='PRODUCT_CATEGORY_ALL' :autoplay="{ delay: 5000, disableOnInteraction: false }" class="pl-ms pr-ms">
        <swiper-slide v-for="(item, index) in props.items" :key="index" >
          <ProductCategoryItemTemplate2 :item="item"/>
        </swiper-slide>
      </swiper>
    </client-only>
  </template>
  <template v-else>
    <NoData />
  </template>
</template>
