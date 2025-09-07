<script lang="ts" setup>
import { watch } from 'vue';
import {
  Swiper,
  SwiperSlide
} from 'swiper/vue';
import {
  Pagination,
  Autoplay
} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { useBanner } from '@/composables/banner/useBanner';

const { getListBanner, fetchBanner } = useBanner();

watch(() => getListBanner.value, (newValue) => {
  if(!newValue) fetchBanner()
}, { immediate: true })

</script>
<template>
  <div class="container">
    <template v-if="getListBanner && getListBanner.length > 0">
      <div class="banner overflow-hidden rd-lg">
        <swiper :modules="[Pagination, Autoplay]" :slides-per-view="1" :space-between="0" :pagination="{ clickable: true }" :autoplay="{ delay: 5000, disableOnInteraction: false }" class="mySwiper">
          <swiper-slide v-for="item in getListBanner" :key="item.id">
            <img :src="item.image" :alt="item.title" />
          </swiper-slide>
        </swiper>
      </div>
    </template>
  </div>
</template>