<script lang="ts" setup>
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Autoplay } from 'swiper/modules';
import { PRODUCT_CATEGORY } from '@/shared/constants/breakpoints';
import type { CategoryProductDTO } from '@/server/types/dto/v1/product.dto';

const props = defineProps<{
  list: CategoryProductDTO;
}>();
</script>
<template>
  <swiper v-if="props.list" :modules="[Navigation, Autoplay]" :breakpoints='PRODUCT_CATEGORY'>
    <swiper-slide v-for="(item,index) in props.list" :key="index">
      <ProductCategoryItemTemplate1 :item="item" />
    </swiper-slide>
  </swiper>
</template>