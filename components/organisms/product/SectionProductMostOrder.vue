<script lang="ts" setup>
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import {
  useDisplayStore
} from '@/stores/shared/useDisplayStore'
import {
  Swiper,
  SwiperSlide
} from 'swiper/vue';
import {
  Navigation,
  Autoplay
} from 'swiper/modules';
import { ROUTES } from '@/shared/constants/routes';
import type { ProductDTO } from '@/server/types/dto/v1/product.dto'
import type { SwiperOptions } from 'swiper/types';

const storeDisplay = useDisplayStore()

const props = withDefaults(defineProps<{
  items?: ProductDTO[]
  loading?: boolean
  headingText?: string
  runSlide?: boolean
  viewMore?: boolean
  background?: string
  breakpoints?: SwiperOptions['breakpoints']
}>(), {
  items: () => [],
  loading: false,
  runSlide: true,
  viewMore: false,
})

</script>

<template>
  <LoadingData v-if="props.loading" />
  <template v-else>
    <Heading v-if="props.headingText" tag="h2" size="xl" weight="semibold" class="black flex justify-between mb-sm">
      {{ props.headingText }}
      <slot>
      <router-link v-if="props.viewMore" :to="{ path: ROUTES.PUBLIC.ORDER.path }" class="mr-ms">
        <Button size="xs" color="secondary" icon="keyboard_arrow_right"/>
      </router-link>
      </slot>
    </Heading>
    <template v-if="runSlide">
      <client-only>
      <swiper :modules="[Navigation, Autoplay]" :breakpoints=props.breakpoints :space-between="10" :navigation="storeDisplay.isMobileTable ? false:true" :autoplay="{ delay: 5000, disableOnInteraction: false }" class="mySwiper">
        <swiper-slide v-for="(product, index) in props.items" :key="index">
          <ProductItemTemplate1 :product="product" :background="props.background" />
        </swiper-slide>
      </swiper>
      </client-only>
    </template>
    <div v-else class="row row-xs">
      <div v-for="(product, index) in props.items" :key="index" class="col-6 mb-sm">
        <ProductItemTemplate1 :product="product" :background="props.background"/>
      </div>
    </div>
  </template>
</template>
