<script setup lang="ts">
import { computed } from 'vue'
import type { StatusCountDTO } from '@/server/types/dto/v1/dashboard.dto'
import { SHIPPING_STATUS } from '@/shared/constants/shipping-status'

const props = defineProps<{
  data: StatusCountDTO[]
}>()

const option = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: (p: any) => {
      const key = p.name as keyof typeof SHIPPING_STATUS
      return `${SHIPPING_STATUS[key].name}: ${p.value}`
    }
  },
  legend: { bottom: 0 },
  series: [
    {
      type: 'pie',
      radius: ["45%", "70%"],
      label: {
        show: true,
        position: 'outside',
        formatter: (p: any) => {
          const key = p.name as keyof typeof SHIPPING_STATUS
          return `{name|${SHIPPING_STATUS[key]?.name}}\n{value|${p.value}}`
        },
        rich: {
          name: {
            fontSize: 13,
            lineHeight: 18,
            color: '#333'
          },
          value: {
            fontSize: 14,
            fontWeight: 600,
            color: '#000'
          }
        }
      },

      labelLine: {
        show: true,
        length: 12,
        length2: 8
      },
      itemStyle: {
        borderRadius: 6,
        borderColor: "#fff",
        borderWidth: 2
      },
      data: props.data.map(i => ({
        name: i.status,
        value: i.count
      }))
    }
  ]
}))
</script>

<template>
  <BaseChart :option="option" height="300px" />
</template>
