<script lang="ts" setup>
import type { ProductDTO } from '@/server/types/dto/v1/product.dto'
import { COLUMN } from '@/shared/constants/column';

const props = withDefaults(defineProps<{
  items?: ProductDTO[]
  loading?: boolean
  headingText?: string
  backgroundItem?: string
  container?: string
  column?: string
  variant?: string
  deleteFavorite?: boolean
}>(), {
  items: () => [],
  loading: false,
  deleteFavorite: false,
})
</script>

<template>
  <div>
    <div :class="container">
      <LoadingData v-if="props.loading" />
      <template v-else>
        <Heading v-if="props.headingText" tag="h2" size="lg" weight="semibold" class="black mb-sm">
          {{ props.headingText }}
        </Heading>
        <div :class="COLUMN.ROW">
          <div v-for="(product, index) in props.items" :key="index" :class="column ? column : 'col-6 mb-sm'">
            <ProductItemTemplate1 :product="product" :background="props.backgroundItem" :variant="props.variant" :deleteFavorite="props.deleteFavorite" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
