<script lang="ts" setup>
import { useFlashSaleCountdown } from '@/composables/product/flash-sale/useFlashSaleCountdown';

const props = withDefaults(defineProps<{
  startDate: string,
  endDate: string,
  color: any,
  flex?: boolean
  sizeCountMedium?: boolean
  showText?: boolean
}>(), {
  startDate: '',
  endDate: '',
  flex: false,
  sizeCountMedium: false,
  showText: true
})

const { status, time, formatted } = useFlashSaleCountdown(
  props.startDate,
  props.endDate
)

</script>

<template>
  <client-only>
    <div v-if="status !== 'ended'" :class="[props.flex ? 'flex gap-xs align-center':'flex flex-direction-column gap-xs text-center']">
      <Text v-if="props.showText" text="Kết thúc sau:" :size="props.sizeCountMedium ? 'normal':'base'" weight="semibold" class="text-uppercase" :style="{ color: props.color }" />
      <div class="flex align-center gap-xs justify-center">
      <div v-for="(v, i) in formatted.split(':')" class="flex align-center gap-xs line-height-1">
        <Text v-if="i !== 0" text=":" weight="medium" :style="{ color: props.color}" />
        <Button :size="props.sizeCountMedium ? 'md':'sm'" tag="span" color="black" :border="false" :key="i">
          {{ v }}
        </Button>
      </div>
      </div>
    </div>
  </client-only>
</template>
