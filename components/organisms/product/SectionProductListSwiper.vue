<script lang="ts" setup>
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Autoplay } from 'swiper/modules';
import type { ProductDTO } from '@/server/types/dto/v1/product.dto'
import type { SwiperOptions } from 'swiper/types';
import { PRODUCT_LIST_SWIPER_DEFAULT } from '@/shared/constants/breakpoints';
import type { ITranslationText } from '@/server/types/dto/v1/itranslation.dto';
import { COLUMN } from '@/shared/constants/column';

const storeDisplay = useDisplayStore()

type HeadingSize = 'xl' | 'lg'

const props = withDefaults(defineProps<{
  items?: ProductDTO[]
  loading?: boolean
  headingText: string | ITranslationText
  headingSize?: HeadingSize
  backgroundItem?: string
  breakpoints?: SwiperOptions['breakpoints']
  container?: string
  showNoData?: boolean
  fullScreen?: boolean
  slug?: string
  skColumn?: string
  skCount?: number
}>(), {
  items: () => [],
  showNoData: false,
  fullScreen: false,
  headingSize: 'xl',
  skColumn: COLUMN.PRODUCT_XL,
  skCount: 6
})
</script>

<template>
  <div>
    <div :class="[container, fullScreen ? 'pl-0 pr-0':'']">
      <SkeletonProductList
        v-if="props.loading || props.items === null"
        :count="props.skCount"
        :row="COLUMN.ROW"
        :column="props.skColumn"
        heading
      />
      <template v-else-if="items.length > 0">
        <Heading :text="props.headingText" :slug="props.slug" :class="fullScreen ? 'pl-ms pr-ms':''" :size="props.headingSize" />
        <client-only>
          <swiper :modules="[Navigation, Autoplay]" :breakpoints='props.breakpoints ? props.breakpoints : PRODUCT_LIST_SWIPER_DEFAULT' :space-between="10" :navigation="storeDisplay.isMobileTable ? false:true" :autoplay="{ delay: 5000, disableOnInteraction: false }" :class="fullScreen ? 'pl-ms pr-ms':''">
            <swiper-slide v-for="(product, index) in props.items" :key="index">
              <ProductItemTemplate1 :product="product" :background="props.backgroundItem" />
            </swiper-slide>
          </swiper>
        </client-only>
      </template>
      <template v-else>
        <NoData v-if="showNoData" />
      </template>
    </div>
  </div>
</template>
