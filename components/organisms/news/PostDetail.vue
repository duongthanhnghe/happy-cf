<script lang="ts" setup>
import type { PostNewsDTO } from '@/server/types/dto/v1/news.dto'
const props = withDefaults(defineProps<{
  item?: PostNewsDTO | null
}>(), {
  item:null
})
</script>

<template>
  <template v-if="item">
    <h1>{{ item.title }}</h1>
    <p>{{ item.summaryContent }}</p>
  </template>
</template>