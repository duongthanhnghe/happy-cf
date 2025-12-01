<template>
  <div
    :class="[
      'card',
      props.size ? `card-size-${props.size}` : '',
      props.bg ? `bg-${props.bg}` : '',
      props.border ? 'card-border' : '',
    ]"
  >
    <Text v-if="props.heading" :text="props.heading" color="black" :size="props.size" weight="semibold" class="mb-sm" />
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
    validator: (value) => ['transparent','white', 'black','black2', 'primary', 'four','danger', 'green', 'gray','gray2','gray4','gray5','gray6','gray8'].includes(value)
  },
  border: {
    type: Boolean,
    default: false,
  },
  heading: {
    type: String,
  }
})
</script>