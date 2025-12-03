<script setup>
import { XIcon } from '@/const/image';

const props = defineProps({
  width: {
    type: Number,
    default: 40
  },
})
</script>
<template>
  <img :src="XIcon" :width="props.width" alt="X icon"/>
</template>