<script lang="ts" setup>
const modelValue = defineModel<string>()

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <div class="position-relative flex-1">
    <v-text-field
      v-model="modelValue"
      label="Tìm kiếm..."
      variant="outlined"
      prepend-inner-icon="mdi-magnify"
      hide-details
      required
      @keydown.enter="emit('submit')"
    />

    <MaterialIcon
      v-if="modelValue !== ''"
      name="cancel"
      class="popup-search-cancel"
      @click="emit('cancel')"
    />
  </div>
</template>
