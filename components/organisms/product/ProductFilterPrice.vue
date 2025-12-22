<script setup lang="ts">
import { useCategoryMainStore } from '@/stores/client/product/useCategoryMainStore'

const storeCategoryMain = useCategoryMainStore()
</script>

<template>
  <v-checkbox
    v-for="range in storeCategoryMain.PRICE_RANGES"
    :key="range.key"
    v-model="storeCategoryMain.selectedPriceRanges"
    :label="range.label"
    :value="range.key"
    hide-details
  />
</template>
