<script setup lang="ts">
const props = defineProps({
  listOrder: {
    type: Array as () => number[],
    default: () => []
  },
  order: {
    type: Number,
    default: 1
  },
  tooltip: {
    type: String,
  }
})

const emit = defineEmits(["update:modelValue"])
</script>

<template>
  <client-only>
    <v-select
      v-tooltip.right="tooltip"
      :items="listOrder"
      :model-value="order"
      variant="outlined"  
      class="v-select-order"
      hide-details
      @update:model-value="emit('update:modelValue', $event)"
    >
      <template v-slot:append>
        <MaterialIcon name="keyboard_arrow_down" :size="16"/>
      </template>
    </v-select>
  </client-only>
</template>
