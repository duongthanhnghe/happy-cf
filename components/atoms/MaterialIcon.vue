<template>
  <span
    :class="`material-symbols-rounded icon text-color-${props.color} text-size-${props.size} weight-${props.weight}`"
  >
    {{ name }}
  </span>
</template>

<script setup>
const props = defineProps({
  name: { type: String, required: true },
  size: { type: String, default: 'lg' },
  color: { type: String, default: 'inherit' },
  weight: { type: String, default: 'normal' }
})
</script>
