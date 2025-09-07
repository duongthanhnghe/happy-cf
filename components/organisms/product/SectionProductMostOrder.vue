<script lang="ts" setup>
import { watch } from 'vue';
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
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

import { useProductMostOrder } from '@/composables/product/useProductMostOrder'

const { getListProductMostOrder, fetchListProductMostOrder } = useProductMostOrder()
const storeDisplay = useDisplayStore()

const props = defineProps({
  headingText: {
    type: String,
  },
  runSlide: {
    type: Boolean,
    default: true
  },
  viewMore: {
    type: Boolean,
    default: false
  },
  background: {
    type: String,
  },
})

watch(() => getListProductMostOrder.value, (newValue) => {
  if(!newValue) fetchListProductMostOrder()
}, { immediate: true })

</script>

<template>
  <Heading v-if="props.headingText" tag="h2" size="xl" weight="semibold" class="black flex justify-between mb-sm">
    {{ props.headingText }}
    <slot>
    <router-link v-if="props.viewMore" :to="{ path: '/order' }" class="mr-ms">
      <Button size="xs" color="secondary" icon="keyboard_arrow_right"/>
    </router-link>
    </slot>
  </Heading>
  <template v-if="getListProductMostOrder && getListProductMostOrder.length > 0">
    <template v-if="runSlide">
      <swiper :modules="[Navigation, Autoplay]" :slides-per-view="2.3" :space-between="10" :navigation="storeDisplay.isMobileTable ? false:true" :autoplay="{ delay: 5000, disableOnInteraction: false }" class="mySwiper">
        <swiper-slide v-for="(product, index) in getListProductMostOrder" :key="index">
          <ProductItemTemplate1 :product="product" :background="props.background" />
        </swiper-slide>
      </swiper>
    </template>
    <div v-else class="row row-sm">
      <div v-for="(product, index) in getListProductMostOrder" :key="index" class="col-6 mb-sm">
        <ProductItemTemplate1 :product="product" :background="props.background"/>
      </div>
    </div>
  </template>
</template>
