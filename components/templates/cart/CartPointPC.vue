<script lang="ts" setup>
import { formatCurrency } from '@/utils/global';
const props = defineProps<{
  userId: string;
  balancePoint: number;
}>();
</script>
<template>
  <Card v-if="props.userId" class="rd-xl mt-sm shadow-1">
    <div class="flex gap-xs align-baseline">
      <Text size="md" color="black" weight="semibold" class="mb-sm" text="Sử dụng điểm" />
      <Text color="gray5" :text="`(Bạn đang có ${ formatCurrency(props.balancePoint).replace('đ','') } điểm)`"/>
    </div>
    <CartPointInput classEl="flex gap-sm" :balancePoint="props.balancePoint"/>
  </Card>
</template>