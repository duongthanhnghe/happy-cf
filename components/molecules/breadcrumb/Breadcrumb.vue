<script lang="ts" setup>
  import '@/styles/molecules/breadcrumb/breadcrumb.scss'
  import { useDisplayStore } from '@/stores/shared/useDisplayStore'
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Pagination, Autoplay } from 'swiper/modules';
  import 'swiper/css';
  import 'swiper/css/pagination';
  import 'swiper/css/autoplay';

  interface Breadcrumb {
    heading: string
    description?: string
    classCustom?: string
    image?: string | string[]
  }

  const props = defineProps<Breadcrumb>()
  const storeDisplay = useDisplayStore();

</script>
<template>
  <div :class="['breadcrumb bg-gray6', props.classCustom]">
    <div v-if="props.image && typeof props.image === 'string'" class="breadcrumb-image">
      <img :src="props.image" :alt="props.heading" class="w-full" />
    </div>
    <div v-else-if="Array.isArray(props.image)" class="breadcrumb-image" >
    <swiper :modules="[Pagination, Autoplay]" :slides-per-view="1" :space-between="0" :pagination="{ clickable: true }" :autoplay="{ delay: 5000, disableOnInteraction: false }">
      <swiper-slide v-for="(item, index) in props.image" :key="index">
        <img :src="item" :alt="props.heading" class="w-full"/>
      </swiper-slide>
    </swiper>
    </div>
    <template v-else></template>
    <div class="container container-xxl pt-md pb-section">
      <Heading tag="h1" :size="storeDisplay.isLaptop ? '2xl':'xl'" weight="semibold" class="breadcrumb-heading black">
        {{ props.heading }}
      </Heading>
      <div>
        <Text color="gray5" v-if="props.description" class="mt-sm" :text="props.description" />
        <slot></slot>
      </div>
    </div>
  </div>
</template>