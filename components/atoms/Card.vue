<template>
  <div
    :class="[
      'card',
      size ? `card-size-${size}` : '',
      bg ? `bg-${bg}` : '',
      border ? 'card-border' : '',
    ]"
  >
    <slot></slot>
  </div>
</template>

<script setup>

const props = defineProps({
  size: {
    type: String,
    default: 'sm',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  bg: {
    type: String,
    default: 'white',
    validator: (value) => ['white', 'black', 'primary', 'danger', 'green', 'gray','gray2','gray4','gray5','gray8'].includes(value)
  },
  border: {
    type: Boolean,
    default: false,
  },
})
</script>