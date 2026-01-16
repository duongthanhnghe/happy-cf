<script setup lang="ts">
import VChart from 'vue-echarts'

defineProps<{
  option: any
  height?: string
}>()

</script>

<template>
  <div class="width-full">
    <VChart
      :option="option"
      autoresize
      :style="{ height: height || '320px' }"
    />
  </div>
</template>
