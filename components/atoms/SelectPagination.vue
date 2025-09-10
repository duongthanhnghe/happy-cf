<script setup lang="ts">
const props = defineProps({
  totalPages: {
    type: Array as () => string[],
    default: () => []
  },
  page: {
    type: String,
    default: "1"
  }
})

const emit = defineEmits(["update:page"])
</script>

<template>
  <client-only>
    <v-select
      :items="totalPages"
      :model-value="page"
      variant="outlined"  
      class="v-select-order weight-semibold"
      hide-details
      @update:model-value="emit('update:page', $event)"
    >
      <template v-slot:append>
        <MaterialIcon name="keyboard_arrow_down" />
      </template>
    </v-select>
  </client-only>
</template>
