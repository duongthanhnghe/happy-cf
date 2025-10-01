<script lang="ts" setup>
import { watch } from 'vue'
import { useOrderStore } from '@/stores/client/product/useOrderIndexStore'
import type { CategoryProductDTO } from '@server/types/dto/product.dto'
import { ROUTES } from '@/shared/constants/routes';

const store = useOrderStore()

const props = withDefaults(defineProps<{
  items?: CategoryProductDTO[]
  loading?: boolean
}>(), {
  items: () => [],
  loading: false,
})

const { data: mappedData } = await useAsyncData(
  'mapProductsByCategory',
  () => {
    if (props.items.length > 0) {
      return store.mapProductsByCategory(props.items)
    }
    return []
  },
  {
    immediate: true,
    // watch: [() => props.items], // re-run khi props.items thay đổi
  }
)

watch(mappedData, (val) => {
  if (val) {
    store.resultData = val
  }
}, { immediate: true })

</script>

<template>
<div class="bg-white product-category-section">
  <div class="container">
    <div class="product-category-list pb-sm">
    <div v-if="props.loading">Đang tải dữ liệu...</div>
    <template v-else>
      <div v-for="category in store.getListProducts" :key="category.id" class="pt-sm" :id="`product-category-scroll${category.id}`" :data-id="`scroll-${category.id}`" rel="js-section-scroll">
        <div class="flex justify-between mb-sm">
          <Heading tag="div" size="md" weight="semibold" class="black">
            {{ category.categoryName }}
          </Heading>
          <NuxtLink :to="`${ROUTES.PUBLIC.PRODUCT.children?.CATEGORY.path}/${category.slug}`">
            <Button color="secondary" size="xs" icon="keyboard_arrow_right" />
          </NuxtLink>
        </div>
        <div v-if="category.children" class="flex gap-xs">
          <NuxtLink v-for="itemChildren in category.children" :to="`${ROUTES.PUBLIC.PRODUCT.children?.CATEGORY.path}/${itemChildren?.slug}`">
            <Button color="secondary" :label="itemChildren?.categoryName" size="xs" />
          </NuxtLink>
        </div>
        <template v-if="category.products.data && category.products.data.length > 0">
          <v-infinite-scroll
          height="auto"
          mode="manual"
          @load="(ctx) => store.load(category, ctx)"
        >
            <div v-for="(item, index) in category.products.data" :key="index" class="mb-sm">
                <ProductItemTemplate1 :product="item" :listView="true" background="bg-white" />
            </div>
          <template #load-more="{ props }">
            <div :class="category.products.pagination.totalPages === 1 ? '_hidden':''">
              <Button color="secondary" label="Tải thêm" @click="props.onClick" />
            </div>
          </template>
        </v-infinite-scroll>
        </template>
      </div>
    </template>
    </div>
  </div>
</div>
</template>
