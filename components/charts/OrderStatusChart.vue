<script setup lang="ts">
import { computed } from 'vue'
import type { StatusCountDTO } from '@/server/types/dto/v1/dashboard.dto'

const props = defineProps<{ data: StatusCountDTO[] }>()

const option = computed(() => ({
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'value' },
  yAxis: {
    type: 'category',
    data: props.data.map(i => i.name)
  },
  series: [
    {
      type: 'bar',
      data: props.data.map(i => i.count)
    }
  ]
}))
</script>

<template>
  <BaseChart :option="option" height="320px" />
</template>
