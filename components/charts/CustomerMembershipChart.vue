<script setup lang="ts">
import { computed } from "vue"
import type { MembershipCountDTO } from "@/server/types/dto/v1/dashboard.dto"

const MEMBERSHIP_LEVEL = {
  Bronze: { label: "Bronze", color: "#CD7F32" },
  Silver: { label: "Silver", color: "#C0C0C0" },
  Gold: { label: "Gold", color: "#FFD700" },
  Platinum: { label: "Platinum", color: "#E5E4E2" },
} as const

const props = defineProps<{
  data: MembershipCountDTO[]
}>()

const option = computed(() => ({
  tooltip: {
    trigger: "item",
    formatter: (p: any) => {
      const key = p.name as keyof typeof MEMBERSHIP_LEVEL
      return `${MEMBERSHIP_LEVEL[key]?.label}: ${p.value}`
    }
  },
  legend: { bottom: 0 },
  series: [
    {
      type: "pie",
      radius: ["45%", "70%"],
      label: {
        show: true,
        position: "outside",
        formatter: (p: any) => {
          const key = p.name as keyof typeof MEMBERSHIP_LEVEL
          return `{name|${MEMBERSHIP_LEVEL[key]?.label}}\n{value|${p.value}}`
        },
        rich: {
          name: {
            fontSize: 13,
            fontWeight: 500,
            color: "#333",
            lineHeight: 18
          },
          value: {
            fontSize: 14,
            fontWeight: 600,
            color: "#000"
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
        name: i.level,
        value: i.count,
        itemStyle: {
          color: MEMBERSHIP_LEVEL[i.level]?.color
        }
      }))
    }
  ]
}))
</script>

<template>
  <BaseChart :option="option" height="300px" />
</template>
