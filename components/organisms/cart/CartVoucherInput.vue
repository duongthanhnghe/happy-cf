<script lang="ts" setup>
import { useCartStore } from '@/stores/client/product/useCartOrderStore'

const store = useCartStore();
const props = defineProps<{
  stackable: boolean;
}>();

</script>
<template>
  <div class="flex gap-sm">
    <v-text-field type="text" placeholder="Nhập mã voucher" v-model="store.voucherCode" variant="outlined" hide-details :disabled="props.stackable"/>
    <Button @click.prevent="store.handleApplyVoucherInput()" color="black" label="Áp dụng" :disabled="!store.voucherCode || props.stackable" />
  </div>
</template>