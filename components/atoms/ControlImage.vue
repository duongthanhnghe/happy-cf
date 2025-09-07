<template>
  <div :class="['control-image-item',className]">
    <div class="control-image-src">
      <img :src="props.src" :alt="props.label" />
    </div>
    <div class="control-image-content">
      <span class="control-image-item-content-label text-limit">{{ props.label }}</span>
    </div>
    <div class="control-image-actions flex gap-xs">
      <slot name="action"></slot>
    </div>
  </div>  
</template>

<script setup>

const props = defineProps({
  src: String,
  label: String,
  className: String,
})

</script>