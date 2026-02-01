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
      :loop="false"
      :auto-height="true"
      :autoplay="{ delay: 5000, disableOnInteraction: false }"
      @swiper="store.onMainSwiper"
    >
      <swiper-slide
        v-for="(item, index) in store.galleryImages"
        :key="index"
      >
        <Image 
          :src="item.src" 
          :alt="detail.productName"
          :width="700"
        />
      </swiper-slide>
    </swiper>
    <ProductDetailBadgeImage :detail="detail"/>
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
      <swiper-slide
        v-for="(item, index) in store.galleryImages"
        :key="index"
      >
        <div class="cursor-pointer product-detail-gallery-thumbs-slide">
          <Image 
            :src="item.src" 
            :alt="detail.productName"
            :width="150"
            :height="150"
            preset="avatar"
            class="rd-lg bg-gray6"
          />
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>