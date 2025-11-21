<script lang="ts" setup>
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css/thumbs';
import { useProductDetailStore } from '@/stores/client/product/useProductDetailStore'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Autoplay, Thumbs } from 'swiper/modules';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import type { ProductDTO } from '@/server/types/dto/v1/product.dto';

const store = useProductDetailStore()
const storeDisplay = useDisplayStore();
const props = defineProps<{
  detail: ProductDTO
}>()
</script>

<template>
  <div class="product-detail-gallery bg-gray6">
    <swiper
      :modules="[Navigation, Autoplay, Thumbs]"
      :navigation="true"
      :autoplay="{ delay: 5000, disableOnInteraction: false }"
      :loop="false"
      class="mySwiper"
      @swiper="store.onMainSwiper"
    >
      <swiper-slide>
        <img :src="detail.image" :alt="detail.productName" />
      </swiper-slide>
      <swiper-slide
        v-for="(item, index) in detail.listImage"
        :key="index"
      >
        <img :src="item.src" :alt="detail.productName" />
      </swiper-slide>
    </swiper>
  </div>

  <div :class="storeDisplay.isMobileTable ? 'container mt-ms':'mt-sm' " >
    <swiper
      :modules="[Navigation, Thumbs]"
      :slides-per-view="5"
      :space-between="10"
      :navigation="false"
      :watch-slides-progress="true"
      :loop="false"
      class="product-detail-gallery-thumbs"
      @swiper="store.onThumbSwiper"
    >
      <swiper-slide class="cursor-pointer">
        <img class="rd-lg bg-gray6" :src="detail.image" :alt="detail.productName" />
      </swiper-slide>
      <swiper-slide
        v-for="(item, index) in detail.listImage"
        :key="index"
        class="cursor-pointer"
      >
        <img class="rd-lg bg-gray6" :src="item.src" :alt="detail.productName" />
      </swiper-slide>
    </swiper>

  </div>
</template>