<template>
  <div
    :class="[
      'position-relative overflow-hidden',
      variant === 'card' ? 'rd-lg pd-05 bg-white cl-shadow-1' : '',
      listView ? 'listView' : ''
    ]"
  >
    <div class="rd-lg overflow-hidden bg-gray6">
      <div class="skeleton aspect-ratio-1p1 w-full"></div>

      <div class="skeleton skeleton-circle position-absolute width-25 height-25 rd-full bottom-05 right-05"></div>
    </div>

    <div
      :class="[
        variant === 'card' ? 'pd-05' : '',
        'pt-ms'
      ]"
    >
      <div class="skeleton skeleton-text width-p90 mb-xs"></div>
      <div class="skeleton skeleton-text width-p70 mb-sm"></div>

      <div class="flex gap-xs align-center">
        <div class="skeleton skeleton-text width-p30"></div>
        <div class="skeleton skeleton-text-sm width-p20"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  withDefaults(defineProps<{
    variant?: 'card' | ''
    listView?: boolean
  }>(), {
    variant: 'card',
    listView: false,
  })
</script>