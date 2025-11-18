<script lang="ts" setup>
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { formatCurrency } from '@/utils/global';

const store = useCartStore();
const props = defineProps<{
  classEl?: string;
  balancePoint: number;
}>();

</script>
<template>
  <div class="mb-xs">
    Tối đa: <Text weight="semibold" color="primary" tag="span" :text="`${formatCurrency(props.balancePoint <= store.getMaxPointCanUse ? props.balancePoint : store.getMaxPointCanUse).replace('đ','')} Point`" />
  </div>
  <div :class="props.classEl">
    <v-text-field type="number" placeholder="Nhập số điểm" v-model="store.usedPointOrder.pointInput" variant="outlined" hide-details/>
    <Button @click.prevent="store.handleCheckPoint()" color="black" label="Ap dung" :disabled="store.usedPointOrder.pointInput == 0" />
  </div>
</template>