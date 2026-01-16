<script setup lang="ts">
import { computed } from 'vue'
import type { RevenueChartDTO } from '@/server/types/dto/v1/dashboard.dto'
import { formatCurrency } from '@/utils/global';

const props = defineProps<{
  data: RevenueChartDTO[]
}>()

const option = computed(() => ({
  tooltip: {
    trigger: 'axis',
    formatter: (params: any) => {
      const p = params[0]
      const item = props.data[p.dataIndex]
      return `
        <b class="text-color-black">${item._id}</b><br/>
        Doanh thu: ${formatCurrency(item.revenue)}<br/>
        Đơn hàng: ${item.orders}
      `
    }
  },
  xAxis: {
    type: 'category',
    data: props.data.map(i => i._id)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      type: 'line',
      smooth: true,
      areaStyle: {},
      data: props.data.map(i => i.revenue)
    }
  ]
}))
</script>

<template>
  <BaseChart :option="option" height="360px" />
</template>
