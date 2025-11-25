<script lang="ts" setup>
import { useCategoryMainStore } from '@/stores/client/product/useCategoryMainStore'
const storeCategoryMain = useCategoryMainStore()
</script>
<template>
  <v-range-slider
    v-model="storeCategoryMain.rangePrice"
    step="10"
    :min="0"
    :max="storeCategoryMain.maxPrice"
    thumb-label="always"
    :thumb-label-props="{ teleport: 'body' }"
  ></v-range-slider>
</template>