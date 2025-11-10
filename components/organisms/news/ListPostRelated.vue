<script lang="ts" setup>
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Autoplay } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';
import type { PostNewsDTO } from '@/server/types/dto/v1/news.dto';

const storeDisplay = useDisplayStore()

const props = withDefaults(defineProps<{
  items?: PostNewsDTO[]
  loading?: boolean
  headingText?: string
  breakpoints?: SwiperOptions['breakpoints']
}>(), {
  items: () => [],
  loading: false,
})

</script>

<template>
  <LoadingData v-if="props.loading" />
  <template v-else>
    <Heading v-if="props.headingText" tag="h2" size="xl" weight="semibold" class="black flex justify-between mb-sm">
      {{ props.headingText }}
    </Heading>
    <client-only>
    <swiper :modules="[Navigation, Autoplay]" :breakpoints=props.breakpoints :space-between="10" :navigation="storeDisplay.isMobileTable ? false:true" :autoplay="{ delay: 5000, disableOnInteraction: false }" class="mySwiper">
      <swiper-slide v-for="item in props.items" :key="item.id">
        {{ item.title }}
      </swiper-slide>
    </swiper>
    </client-only>
  </template>
</template>
