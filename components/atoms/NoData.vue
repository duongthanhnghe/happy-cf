<script setup>
import { IMAGE_EMPTY_DEFAULT } from '@/const/image'

const props = defineProps({
  text: {
    type: String,
    default: 'Không có dữ liệu',
  },
  image: {
    type: String,
    default: IMAGE_EMPTY_DEFAULT,
  },
})
</script>

<template>
  <client-only>
    <div class="no-data text-center">
      <div class="no-data-image">
        <Image 
          :src="image"
          :alt="text"
          :width="185"
        />
      </div>
      <div class="no-data-text mt-sm text-color-gray5">
        {{ text }}
      </div>
    </div>
  </client-only>
</template>
