<script lang="ts" setup>
import '@/styles/molecules/breadcrumb/breadcrumb.scss'
import { useDisplayStore } from '@/stores/shared/useDisplayStore'

  interface Breadcrumb {
    heading: string
    description?: string
    classCustom?: string
    image?: string
  }

  const props = defineProps<Breadcrumb>()
  const storeDisplay = useDisplayStore();

</script>
<template>
  <div :class="['breadcrumb bg-gray6', props.classCustom]">
    <div v-if="props.image" class="breadcrumb-image">
      <img :src="props.image" :alt="props.heading">
    </div>
    <div class="container container-xxl pt-md pb-md">
      <Heading tag="h1" :size="storeDisplay.isLaptop ? '2xl':'xl'" weight="semibold" class="breadcrumb-heading black">
        {{ props.heading }}
      </Heading>
      <div>
        <Text color="gray5" v-if="props.description" class="mt-sm" :text="props.description" />
        <slot></slot>
      </div>
    </div>
  </div>
</template>