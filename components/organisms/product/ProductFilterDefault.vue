<script lang="ts" setup>
import { useCategoryMainStore } from '@/stores/client/product/useCategoryMainStore'
const storeCategoryMain = useCategoryMainStore()
</script>
<template>
  <v-select
    v-model="storeCategoryMain.filterType"
    :items="[{title: 'Moi nhat',value:''},...storeCategoryMain.filterArray]"
    item-title="title"
    item-value="value"
    variant="outlined"
    hide-details
  />
</template>