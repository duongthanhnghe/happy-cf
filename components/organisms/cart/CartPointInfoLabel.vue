<script lang="ts" setup>
const props = defineProps<{
  getTotalPoint: number;
}>();
</script>
<template>
  <Card border class="rd-xl flex justify-between mt-sm cart-point-info-label">
    Được hoàn điểm thưởng
    <span class="flex gap-xs weight-semibold">
      <Button tag="span" size="xs" color="secondary" icon="diamond_shine"/>
      {{ props.getTotalPoint }}
    </span>
  </Card>
</template>