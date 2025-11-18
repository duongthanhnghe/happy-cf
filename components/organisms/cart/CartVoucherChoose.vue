<script lang="ts" setup>
import { useCartStore } from '@/stores/client/product/useCartOrderStore'

const store = useCartStore();

</script>
<template>
 <template v-if="store.voucherUsage.length > 0">
    <Button
      v-for="(voucherUsage, index) in store.voucherUsage"
      color="secondary" size="sm" class="pl-sm pr-sm" @click.prevent="store.removeVoucher(voucherUsage.code, voucherUsage.type);" :label="voucherUsage.code">
      <MaterialIcon class="ml-xs" name="close"/>
    </Button>
  </template>
</template>