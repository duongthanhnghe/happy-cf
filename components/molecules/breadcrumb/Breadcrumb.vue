<script lang="ts" setup>
import { computed } from 'vue'
import '@/styles/molecules/breadcrumb/breadcrumb.scss'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { BANNER_LAZY } from '@/const/image';

interface Breadcrumb {
  heading: string
  description?: string
  classCustom?: string
  image?: string | string[] | null
}

const props = defineProps<Breadcrumb>()

const isMultipleImages = computed(() => {
  return Array.isArray(props.image) && props.image.length > 1
})

const isSingleImageArray = computed(() => {
  return Array.isArray(props.image) && props.image.length === 1
})

const singleImage = computed(() => {
  if (isSingleImageArray.value && Array.isArray(props.image)) {
    return props.image[0]
  }
  return typeof props.image === 'string' ? props.image : null
})
</script>

<template>
  <div :class="['breadcrumb bg-gray6', props.classCustom]">
    <div v-if="singleImage" class="breadcrumb-image">
      <Image 
        :src="singleImage"
        :alt="props.heading"
        class="w-full"
        :width="1920"
        :placeholder="BANNER_LAZY"
      />
    </div>
    
    <div v-else-if="isMultipleImages" class="breadcrumb-image">
      <swiper 
        :modules="[Pagination, Autoplay]" 
        :slides-per-view="1" 
        :space-between="0" 
        :pagination="{ clickable: true }" 
        :autoplay="{ delay: 5000, disableOnInteraction: false }"
        :loop="true"
      >
        <swiper-slide v-for="(item, index) in props.image" :key="index">
          <Image 
            :src="item"
            :alt="`${props.heading} - ${index + 1}`"
            class="w-full"
            :width="1920"
            :placeholder="BANNER_LAZY"
          />
        </swiper-slide>
      </swiper>
    </div>
    
    <div class="container container-xxl pt-md pb-section">
      <Heading :text="props.heading" tag="h1" size="xxl" />

      <div>
        <Text color="gray5" v-if="props.description" :text="props.description" />
        <slot></slot>
      </div>
    </div>
  </div>
</template>

