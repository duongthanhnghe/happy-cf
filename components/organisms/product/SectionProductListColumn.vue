<script lang="ts" setup>
import type { ProductDTO } from '@/server/types/dto/v1/product.dto'
import { COLUMN } from '@/shared/constants/column';

type HeadingSize = 'xl' | 'lg'

const props = withDefaults(defineProps<{
  items?: ProductDTO[]
  loading?: boolean
  headingText?: string
  headingSize?: HeadingSize
  backgroundItem?: string
  container?: string
  column?: string
  variant?: string
  deleteFavorite?: boolean
  showNoData?: boolean
}>(), {
  items: () => [],
  loading: false,
  deleteFavorite: false,
  showNoData: false,
  headingSize: 'xl'
})
</script>

<template>
  <div>
    <div :class="container">
      <LoadingData v-if="props.loading" />
      <template v-else-if="!props.loading && items.length > 0">
        <Heading :text="props.headingText" :size="props.headingSize" />

        <div :class="COLUMN.ROW">
          <div v-for="(product, index) in props.items" :key="index" :class="column ? column : 'col-6 mb-sm'">
            <ProductItemTemplate1 :product="product" :background="props.backgroundItem" :variant="props.variant" :deleteFavorite="props.deleteFavorite" />
          </div>
        </div>
      </template>
      <template v-else>
        <NoData v-if="showNoData" />
      </template>
    </div>
  </div>
</template>
