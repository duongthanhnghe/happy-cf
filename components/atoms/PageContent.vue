<template>
  <div class="container pt-section pb-section">
    <Heading :text="props.heading" size="xxl" align="center" />
    <Text :text="props.content" />
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  heading: string | number | object
  content: string | number | object
}>(), {
  heading: '',
  content: '',
})

</script>