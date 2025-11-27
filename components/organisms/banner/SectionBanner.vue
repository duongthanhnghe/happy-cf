<script lang="ts" setup>
import type { BannerDTO } from '@/server/types/dto/v1/banner.dto'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const props = withDefaults(defineProps<{
  items?: BannerDTO[]
  loading?: boolean
}>(), {
  items: () => [],
  loading: false,
})
</script>
<template>
  <div class="container container-xxl">
    <LoadingData v-if="props.loading && props.items.length === 0" />
    <template v-else>
      <div class="banner overflow-hidden rd-lg shadow-2">
        <swiper :modules="[Pagination, Autoplay]" :slides-per-view="1" :space-between="0" :pagination="{ clickable: true }" :autoplay="{ delay: 5000, disableOnInteraction: false }">
          <swiper-slide v-for="item in props.items" :key="item.id">
            <img :src="item.image" :alt="item.title" class="w-full"/>
          </swiper-slide>
        </swiper>
      </div>
    </template>
  </div>
</template>