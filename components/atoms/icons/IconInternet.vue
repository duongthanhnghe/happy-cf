<script setup>
import { InternetIcon } from '@/const/image';

const props = defineProps({
  width: {
    type: Number,
    default: 40
  },
})
</script>
<template>
  <img :src="InternetIcon" :width="props.width" alt="Internet icon"/>
</template>