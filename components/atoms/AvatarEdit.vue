<template>
    <div :class="['avatar-edit',className]" :style="{ width, height }">
      <slot></slot>
      <div class="avatar-edit-text">{{label}}</div>
    </div>
</template>

<script setup>

const props = defineProps({
  width: String,
  height: String,
  label: String,
  className: String,
})

</script>