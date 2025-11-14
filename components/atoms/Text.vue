<template>
  <component
    :is="tag"
    :class="[
      weight ? `weight-${weight}` : '',
      align ? `text-${align}` : '',
      size ? `text-size-${size}` : '',
      color ? `text-color-${color}` : '',
      limit ? `text-limit text-limit-${limit}` : '',
      lineHeight ? `line-height-${lineHeight}` : '',
      textClass
    ]"
  >
    {{ text }}
    <slot></slot>
  </component>
</template>

<script setup>

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  tag: {
    type: String,
    default: 'div',
    validator: (value) => ['p','span','div','b','strong','i',''].includes(value)
  },
  size: {
    type: String,
    default: '',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl',''].includes(value)
  },
  lineHeight: {
    type: String,
    default: '',
    validator: (value) => ['1', '1d2', '1d4', '1d6', '1d8', '2',''].includes(value)
  },
  color: {
    type: String,
    default: '',
    validator: (value) => ['','white', 'black', 'primary', 'danger', 'green', 'gray','gray2','gray4','gray5','gray8'].includes(value)
  },
  weight: {
    type: String,
    default: '',
    validator: (value) => ['','light', 'normal', 'medium', 'semibold', 'bold'].includes(value)
  },
  align: {
    type: String,
    default: '',
    validator: (value) => ['','left', 'center', 'right'].includes(value)
  },
  limit: {
    type: String,
    default: '',
    validator: (value) => ['','1', '2', '3', '4'].includes(value)
  },
  textClass: {
    type: String,
    default: '',
  },
})
</script>