<script lang="ts" setup>
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import type { PostNewsDTO } from '@/server/types/dto/v1/news.dto'
import type { SwiperOptions } from 'swiper/types';
import { NEWS_LIST_SWIPER_DEFAULT } from '@/shared/constants/breakpoints';

const storeDisplay = useDisplayStore()

const props = withDefaults(defineProps<{
  items?: PostNewsDTO[]
  loading?: boolean
  headingText?: string
  backgroundItem?: string
  breakpoints?: SwiperOptions['breakpoints']
  container?: string
  pagination?: boolean
}>(), {
  items: () => [],
  pagination: false,
})

</script>

<template>
  <div>
    <div :class="[container]">
      <LoadingData v-if="props.loading && !items" />
      <template v-else-if="items.length > 0">
        <Heading v-if="props.headingText" tag="h2" size="lg" weight="semibold" class="black mb-sm">
          {{ props.headingText }}
        </Heading>
        <client-only>
          <swiper :modules="[Pagination, Navigation, Autoplay]" :breakpoints='props.breakpoints ? props.breakpoints : NEWS_LIST_SWIPER_DEFAULT' :pagination="props.pagination ? { clickable: true }:false" :navigation="storeDisplay.isMobileTable ? false:true" :autoplay="{ delay: 5000, disableOnInteraction: false }" >
            <swiper-slide v-for="(item, index) in props.items" :key="index">
              <NewsItemTemplate2 :item="item" />
            </swiper-slide>
          </swiper>
        </client-only>
      </template>
      <template v-else />
    </div>
  </div>
</template>
