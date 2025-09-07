<template>
    <div
      :id="labelId"
      :class="[
        'portal-label mb-xs',
        labelClass
      ]"
    >
      <span class="portal-label-text text-color-title weight-medium">
        {{ label }}
        <span v-if="required" class="text-color-danger ml-xs">*</span>
      </span>
      <span class="portal-label-slot text-color-danger">
        <slot></slot>
      </span>
    </div>
</template>

<script setup>

const props = defineProps({
  label: String,
  required: {
    type: Boolean,
    default: false
  },
  labelClass: {
    type: String,
    default: '',
  },
  labelId: {
    type: String,
    default: '',
  },
})
</script>
