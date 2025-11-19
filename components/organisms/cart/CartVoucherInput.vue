<script lang="ts" setup>
import { useCartStore } from '@/stores/client/product/useCartOrderStore'

const store = useCartStore();

</script>
<template>
  <div class="flex gap-sm">
    <v-text-field type="text" placeholder="Nhập mã voucher" v-model="store.voucherCode" variant="outlined" hide-details/>
    <Button @click.prevent="store.handleApplyVoucherInput()" color="black" label="Ap dung" :disabled="!store.voucherCode" />
  </div>
</template>