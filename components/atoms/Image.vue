<script setup lang="ts">
import { computed } from 'vue'
import { IMAGE_LAZY } from '@/const/image';

interface Props {
  src: string
  preset?: string
  alt?: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  class?: string | string[]
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: 'lazy',
  alt: 'Image',
  placeholder: IMAGE_LAZY
})

const isCloudinary = computed(() => props.src?.includes('cloudinary.com'))

const extractPublicId = (url: string): string => {
  if (!url || !url.includes('cloudinary.com')) return url
  const match = url.match(/\/upload\/(.+)\.(jpg|jpeg|png|webp|gif|avif)/)
  return match ? match[1] : url
}

const imageSrc = computed(() => {
  return isCloudinary.value ? extractPublicId(props.src) : props.src
})

const imageProvider = computed(() => {
  return isCloudinary.value ? 'cloudinary' : undefined
})
</script>

<template>
  <NuxtImg 
    v-if="src"
    :provider="imageProvider"
    :src="imageSrc"
    :preset="isCloudinary ? preset : undefined"
    :loading="loading"
    :alt="alt"
    :width="width"
    :height="height"
    :class="class"
    :placeholder="placeholder"
  />
</template>