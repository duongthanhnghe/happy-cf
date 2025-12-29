<script setup lang="ts">
import { computed } from 'vue'
import { useDisplayStore } from '@/stores/shared/useDisplayStore'

const storeDisplay = useDisplayStore()

const props = defineProps({
  length: { type: Number, required: true },
})

const wrapperClass = computed(() => {
  if (props.length <= 1) return ''

  return [
    'flex',
    storeDisplay.isMobileTable
      ? 'flex-direction-column gap-ms'
      : 'flex-direction-row gap-md',
  ]
})
</script>

<template>
  <div :class="wrapperClass">
    <slot />
  </div>
</template>
