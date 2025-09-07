<template>
  <span
    class="material-symbols-rounded icon"
    :style="styleObject"
  >
    {{ name }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [String, Number], default: 20 },
  color: { type: String, default: 'inherit' },
  weight: { type: [String, Number], default: 400 }
})

const fontSize = computed(() => {
  const val = props.size
  if (typeof val === 'number') return `${val}px`
  if (/^\d+$/.test(val)) return `${val}px`
  return val
})

const styleObject = computed(() => ({
  fontSize: fontSize.value,
  color: props.color,
  fontVariationSettings: `'FILL' 0, 'wght' ${props.weight}, 'GRAD' 0, 'opsz' ${parseInt(fontSize.value)}`
}))
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
