<template>
  <div v-if="heading" class="skeleton-text-xl mb-sm">
    <div class="skeleton height-full width-p20"></div>
  </div>
  <div :class="[row, rowClass]">
    <div v-for="n in count" :key="n" :class="column">
      <SkeletonProductTemplate1
        :variant="variant"
        :listView="listView"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

withDefaults(defineProps<{
  count?: number
  variant?: 'card' | ''
  listView?: boolean
  row?: string
  rowClass?: string
  column?: string
  heading?: boolean
}>(), {
  count: 6,
  variant: '',
  listView: false,
  row: 'flex',
  column: 'col-6 mb-sm',
  heading: false
})

</script>
