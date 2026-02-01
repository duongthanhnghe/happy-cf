<script lang="ts" setup>
import { useFlashSaleCountdown } from '@/composables/product/flash-sale/useFlashSaleCountdown';

const props = withDefaults(defineProps<{
  startDate: string,
  endDate: string,
  color: any,
  flex: boolean
}>(), {
  startDate: '',
  endDate: '',
  flex: false
})

const { status, time, formatted } = useFlashSaleCountdown(
  props.startDate,
  props.endDate
)

</script>

<template>
  <client-only>
    <div v-if="status !== 'ended'" :class="[props.flex ? 'flex gap-xs align-center':'flex flex-direction-column gap-xs text-center']">
      <Text text="Kết thúc sau:" weight="semibold" class="text-uppercase" :style="{ color: props.color }" />
      <div class="flex align-center gap-xs">
      <div v-for="(v, i) in formatted.split(':')" class="flex align-center gap-xs line-height-1">
        <Text v-if="i !== 0" text=":" weight="medium" :style="{ color: props.color}" />
        <Button size="sm" tag="span" color="black" :border="false" :key="i">
          {{ v }}
        </Button>
      </div>
      </div>
    </div>
  </client-only>
</template>
