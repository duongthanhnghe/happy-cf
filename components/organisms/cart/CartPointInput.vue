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
    Tối đa: <Text weight="semibold" color="primary" tag="span" :text="`${formatCurrency(props.balancePoint <= store.getMaxPointCanUse ? props.balancePoint : store.getMaxPointCanUse).replace('đ','')} điểm`" />
  </div>
  <div :class="props.classEl">
    <v-text-field 
      type="number" 
      placeholder="Nhập số điểm" 
      :model-value="store.usedPointOrder.pointInput"
      variant="outlined" 
      clearable 
      hide-details
      @update:modelValue="val => {
        store.usedPointOrder.pointInput = Number(val) || 0
      }"
      @click:clear="store.resetPoint"
    />
    <Button @click.prevent="store.handleCheckPoint()" color="black" label="Áp dụng" :disabled="store.usedPointOrder.pointInput == 0" />
  </div>
</template>