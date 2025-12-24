<script setup lang="ts">
defineProps<{
  priceRanges: {
    key: string
    label: string
  }[]
  selectedPriceRanges: string[]
  onTogglePrice: (key: string) => void
}>()
</script>

<template>
  <v-checkbox
    v-for="range in priceRanges"
    :key="range.key"
    :model-value="selectedPriceRanges.includes(range.key)"
    :label="range.label"
    hide-details
    @click="onTogglePrice(range.key)"
  />
</template>
