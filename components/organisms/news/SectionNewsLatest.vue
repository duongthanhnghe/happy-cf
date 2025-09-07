<script lang="ts" setup>
import { watch } from 'vue';
import { useNewsLatest } from '@/composables/news/useNewsLatest'

const { getListNewsLatest, getApiListNewsLatest } = useNewsLatest()

const props = defineProps({
  headingText: {
    type: String,
  }
})

watch(() => getListNewsLatest.value, (newValue) => {
  if(!newValue) getApiListNewsLatest()
}, { immediate: true })

</script>

<template>
  <div class="container">
    <Heading tag="h2" size="xl" weight="semibold" class="black mb-sm">
      {{ props.headingText }}
    </Heading>
    <div v-if="getListNewsLatest && getListNewsLatest.length > 0">
      <template v-for="(item, index) in getListNewsLatest" :key="index">
        <NewsItemTemplate1 :item="item" />
      </template>
    </div>
  </div>
</template>
