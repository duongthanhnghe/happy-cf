<script lang="ts" setup>
import { watch } from 'vue'
import { useOrderStore } from '@/stores/product/useOrderIndexStore'
import { useProductCategory } from '@/composables/product/useProductCategory'

const store = useOrderStore()
const { fetchCategoryList, getListCategory } = useProductCategory()

const { pending, error } = await useAsyncData('categoriesProduct', () => fetchCategoryList())

watch(
  () => getListCategory.value,
  async (newVal) => {
    if (newVal?.length) {
      const mapped = await store.mapProductsByCategory(newVal)
      store.resultData = mapped
    }
  },
  { immediate: true }
)

</script>

<template>
<div class="bg-white product-category-section">
  <div class="container">
    <div class="product-category-list pb-sm">
    <div v-if="pending">Đang tải dữ liệu...</div>
    <div v-else-if="error">
      <p>Lỗi: {{ error.message }}</p>
    </div>
    <div v-else-if="!store.getListProducts?.length">
      <NoData />
    </div>
      <template v-else>
        <div v-for="category in store.getListProducts" :key="category.id" class="pt-sm" :id="`product-category-scroll${category.id}`" :data-id="`scroll-${category.id}`" rel="js-section-scroll">
          <Heading tag="div" size="md" weight="semibold" class="black mb-xs">
            {{ category.categoryName }}
          </Heading>
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
