<script setup lang="ts">
  const props = defineProps<{
    text?: string
  }>()
</script>

<template>
  <Button
    class="weight-medium text-size-xs" 
    color="four" 
    size="xs" 
    :label="props.text || 'Flash sale'" 
    icon="electric_bolt"
    tag="span"
  />
</template>
