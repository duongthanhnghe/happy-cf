<script lang="ts" setup>
import type { ProductReviewDTO } from '@/server/types/dto/v1/product-review.dto';

const props = withDefaults(defineProps<{
  items?: ProductReviewDTO[]
  loading?: boolean
}>(), {
  items: () => [],
  loading: false,
})

</script>

<template>
  <LoadingData v-if="props.loading && props.items === null" />
  <template v-else>
    <div v-for="item in props.items" :key="item.id">
      <div class="mt-md">
        {{ item.comment }}
      </div>
    </div>
  </template>
</template>
