<template>
  <div :class="['breadcrumb', props.classCustom]">
    <div class="container">
      <Heading tag="h1" size="xl" weight="semibold" class="breadcrumb-heading black">
        {{ props.heading }}
      </Heading>
      <div class="flex justify-between gap-md">
        <div class="mt-sm">
          {{ props.description }}
        </div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  interface Breadcrumb {
    heading: string
    description?: string
    classCustom?: string
  }

  const props = defineProps<Breadcrumb>()
</script>