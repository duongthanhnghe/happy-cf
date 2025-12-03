<script setup>
import { LinkedinIcon } from '@/const/image';

const props = defineProps({
  width: {
    type: Number,
    default: 40
  },
})
</script>
<template>
  <img :src="LinkedinIcon" :width="props.width" alt="Linkedin icon"/>
</template>