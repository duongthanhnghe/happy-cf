<script lang="ts" setup>
import type { PostNewsDTO } from '@/server/types/dto/v1/news.dto'

const props = withDefaults(defineProps<{
  items?: PostNewsDTO[]
  loading?: boolean
  headingText?: string
}>(), {
  items: () => [],
  loading: false,
  headingText: '',
})

</script>

<template>
  <LoadingData v-if="props.loading" />
  <template v-else>
    <div class="container">
      <Heading tag="h2" size="xl" weight="semibold" class="black mb-sm">
        {{ props.headingText }}
      </Heading>
      <template v-for="(item, index) in props.items" :key="index">
        <NewsItemTemplate1 :item="item" />
      </template>
    </div>
  </template>
</template>
