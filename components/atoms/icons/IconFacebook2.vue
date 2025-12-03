<script setup>
import { FacebookIcon } from '@/const/image';

const props = defineProps({
  width: {
    type: Number,
    default: 40
  },
})
</script>
<template>
  <img :src="FacebookIcon" :width="props.width" alt="Facebook icon"/>
</template>