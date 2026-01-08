<script lang="ts" setup>
import type { BannerDTO } from '@/server/types/dto/v1/banner.dto'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import { BANNER_LAZY } from '@/const/image';

const props = withDefaults(defineProps<{
  items?: BannerDTO[]
  loading?: boolean
}>(), {
  items: () => [],
  loading: false,
})

const storeDisplay = useDisplayStore()

</script>
<template>
  <div class="container container-xxl">
    <LoadingData v-if="props.loading && props.items.length === 0" />
    <template v-else>
      <div :class="[storeDisplay.isLaptop ? 'rd-xl':'rd-lg','overflow-hidden shadow-2']">
        <swiper :modules="[Pagination, Autoplay, Navigation]" :slides-per-view="1" :space-between="0" :pagination="{ clickable: true }" :navigation="storeDisplay.isMobileTable ? false:true" :autoplay="{ delay: 5000, disableOnInteraction: false }">
          <swiper-slide v-for="item in props.items" :key="item.id">
            <Image 
              :src="item.image"
              :alt="item.title"
              class="w-full"
              :width="1800"
              :placeholder="BANNER_LAZY"
            />
          </swiper-slide>
        </swiper>
      </div>
    </template>
  </div>
</template>