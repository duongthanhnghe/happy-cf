<script lang="ts" setup>
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
const store = useCartStore();
</script>
<template>
  <template
    v-for="(voucherUsage, index) in store.voucherUsage"
    :key="voucherUsage.code"
  >
    <Text
      color="gray5"
      :text="voucherUsage.code"
    />
    <span v-if="index < store.voucherUsage.length - 1">, </span>
  </template>
</template>