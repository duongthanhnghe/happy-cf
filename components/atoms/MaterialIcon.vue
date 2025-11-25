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

<style scoped>
.material-symbols-rounded {
  font-family: 'Material Symbols Rounded';
  font-style: normal;
  display: inline-block;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}
</style>
