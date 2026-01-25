<template>
  <div
    :class="[
      'card',
      props.size ? `card-size-${props.size}` : '',
      props.bg ? `bg-${props.bg}` : '',
      props.border ? 'card-border' : '',
    ]"
  >
    <Heading v-if="props.heading" :text="props.heading" :size="props.headingSize" />
    <slot></slot>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  size: {
    type: String,
    default: 'sm',
    validator: (value: string) => ['xs', 'ms','sm', 'md', 'lg', 'xl'].includes(value)
  },
  bg: {
    type: String,
    default: 'white',
    validator: (value) => ['transparent','white', 'black','black2', 'primary', 'four','danger', 'green', 'gray','gray2','gray4','gray5','gray6','gray8','gradient-3'].includes(value)
  },
  border: {
    type: Boolean,
    default: false,
  },
  heading: {
    type: String,
  },
  headingSize: {
    type: String,
    default: 'lg',
    validator: (value: string) => ['base' , 'normal' , 'lg' , 'xl' , 'xxl'].includes(value)
  }
})
</script>