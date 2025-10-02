<script lang="ts" setup>
import { watch } from 'vue'
import { useOrderStore } from '@/stores/client/product/useOrderIndexStore'
import type { CategoryProductDTO } from '@server/types/dto/product.dto'
import { ROUTES } from '@/shared/constants/routes';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';

const store = useOrderStore()
const storeDisplay = useDisplayStore()

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
      <div v-for="category in store.getListProducts" :key="category.id" :id="`product-category-scroll${category.id}`" :data-id="`scroll-${category.id}`" rel="js-section-scroll">
        <div class="flex justify-between mb-sm sticky bg-white pt-sm z-index-3">
          <Heading tag="div" size="md" weight="semibold" class="black">
            {{ category.categoryName }}
          </Heading>
          <div  class="flex gap-xs">
            <Button
              v-if="category.children && category.children.length > 1"
              v-for="item in [{ id: category.id, categoryName: 'Tat ca' }, ...category.children]"
              :key="item.id"
              :label="item.categoryName"
              :class="['weight-normal',{ 'active': store.filterCategory[category.id] === item.id }]"
              :color="store.filterCategory[category.id] === item.id ? 'gray':'secondary'"
              size="sm"
              @click="store.filterCategory[category.id] = item.id"
            />
            <NuxtLink :to="`${ROUTES.PUBLIC.PRODUCT.children?.CATEGORY.path}/${category.slug}`">
              <Button color="secondary" size="sm" icon="keyboard_arrow_right" />
            </NuxtLink>
          </div>
        </div>
        <template v-if="category.products.data && category.products.data.length > 0">
          <v-infinite-scroll
          height="auto"
          mode="manual"
          :class="storeDisplay.isLaptop ? 'row row-sm flex-direction-row':''"
          @load="(ctx) => store.load(category, ctx)"
        >
            <div 
            v-for="(item, index) in category.products.data" 
            :key="index" 
            class=""
            :class="[storeDisplay.isLaptop ? 'col-6 col-md-4 col-lg-3 mb-md':'mb-sm',{ _hidden: store.filterCategory[category.id] !== category.id && item.categoryId !== store.filterCategory[category.id] }]"
          >
            <ProductItemTemplate1 
              :product="item" 
              :listView="storeDisplay.isLaptop ? false : true" 
              background="bg-white" 
            />
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
