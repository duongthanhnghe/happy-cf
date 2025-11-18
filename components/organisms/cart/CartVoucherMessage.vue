<script lang="ts" setup>
import { useCartStore } from '@/stores/client/product/useCartOrderStore'

const store = useCartStore();

</script>
<template>
  <div v-if="store.messageVoucher" v-html="store.messageVoucher" class="text-color-green mb-sm"></div>
</template>