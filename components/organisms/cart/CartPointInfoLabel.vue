<script lang="ts" setup>
const props = defineProps<{
  getTotalPoint: number;
}>();
</script>
<template>
  <Card border class="rd-xl flex justify-between mt-sm">
    Tang diem tuy lich
    <span class="flex gap-xs weight-semibold">
      <Button size="xs" color="secondary" icon="diamond_shine"/>
      {{ props.getTotalPoint }}
    </span>
  </Card>
</template>