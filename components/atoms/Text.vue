<template>
  <div
    :is="tag"
    :class="classList"
    v-if="props.text?.type=== 'html'"
    v-html="props.text.text"
  />

  <component
    v-else
    :is="tag"
    :class="classList"
  >
    {{ props.text.text ? props.text.text : props.text }}
    <slot />
  </component>
</template>

<script setup>
const props = defineProps({
  text: {
    type: [String, Number, Object],
    default: '',
  },
  tag: {
    type: String,
    default: 'div',
    validator: (value) => ['h1','h2','h3','h4','h5','h6','p','span','div','b','strong','i',''].includes(value)
  },
  size: {
    type: String,
    default: '',
    validator: (value) => ['xs','base','normal','sm','md','lg','lg-2','xl','xxl',''].includes(value)
  },
  lineHeight: {
    type: String,
    default: '',
    validator: (value) => ['1','1d2','1d4','1d6','1d8','2',''].includes(value)
  },
  color: {
    type: String,
    default: '',
    validator: (value) => ['','white','black','primary','third','danger','green','gray','gray2','gray4','gray5','gray8'].includes(value)
  },
  hover: {
    type: String,
    default: '',
    validator: (value) => ['','white','black','primary','danger','green','gray','gray2','gray4','gray5','gray8'].includes(value)
  },
  weight: {
    type: String,
    default: '',
    validator: (value) => ['','light','normal','medium','semibold','bold'].includes(value)
  },
  align: {
    type: String,
    default: '',
    validator: (value) => ['','left','center','right'].includes(value)
  },
  limit: {
    type: String,
    default: '',
    validator: (value) => ['','1','2','3','4'].includes(value)
  },
  textClass: {
    type: String,
    default: '',
  },
})

const classList = computed(() => [
  props.weight ? `weight-${props.weight}` : '',
  props.align ? `text-${props.align}` : '',
  props.size ? `text-size-${props.size}` : '',
  props.color ? `text-color-${props.color}` : '',
  props.limit ? `text-limit text-limit-${props.limit}` : '',
  props.lineHeight ? `line-height-${props.lineHeight}` : '',
  props.hover ? `transition-0d3 text-hover-${props.hover}` : '',
  props.textClass,
])
</script>
