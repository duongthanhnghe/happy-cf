<template>
    <component
      :is="tag"
      :id="headingId"
      :class="[
        'heading',
        size ? `heading-${size}` : '',
        weight ? `weight-${weight}` : '',
        align ? `text-${align}` : '',
        headingClass
      ]"
    >
      <slot></slot>
      <MaterialIcon v-if="icon" :name="icon" size="lg-2" class="heading-icon" />
    </component>
</template>

<script setup>

const props = defineProps({
  tag: {
    type: String,
    default: 'div',
    validator: (value) => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6','p','span','div'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(value)
  },
  weight: {
    type: String,
    default: 'normal',
    validator: (value) => ['light', 'normal', 'medium', 'semibold', 'bold'].includes(value)
  },
  align: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'center', 'right'].includes(value)
  },
  icon: String,
  headingClass: {
    type: String,
    default: '',
  },
  headingId: {
    type: String,
    default: '',
  },
})
</script>