<script lang="ts" setup>
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { VOUCHER_TYPE } from '@/shared/constants/voucher-type';

const store = useCartStore();
const props = defineProps<{
  classEl?: string;
  classElFreeship?: string;
}>();

</script>
<template>
  <VoucherItemTemplate1
    v-for="(voucher, index) in store.allVouchers.filter(v => v.type === VOUCHER_TYPE.freeship.type)"
    :key="'freeship-' + index"
    :item="voucher"
    action
    :selectedCode="store.selectedFreeship"
    @select="store.handleSelectVoucher"
    :class="[props.classEl, props.classElFreeship]"
  />
  <VoucherItemTemplate1
    v-for="(voucher, index) in store.allVouchers.filter(v => v.type !== VOUCHER_TYPE.freeship.type)"
    :key="'other-' + index"
    :item="voucher"
    action
    :selectedCode="store.selectedVoucher"
    @select="store.handleSelectVoucher"
    :class="props.classEl"
  />
</template>