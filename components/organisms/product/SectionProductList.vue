<script lang="ts" setup>
import { watch } from 'vue'
import {
  useOrderStore
} from '@/stores/product/useOrderIndexStore'

const store = useOrderStore()

watch(() => store.getListProducts, (newValue) => {
  if(!newValue) store.getListAllProduct()
}, { immediate: true })

</script>

<template>
<div class="bg-white product-category-section">
  <div class="container">
    <div class="product-category-list pb-sm">
      <template v-if="store.getListProducts && store.getListProducts.length > 0">
        <div v-for="category in store.getListProducts" :key="category.id" class="pt-sm" :id="`product-category-scroll${category.id}`" :data-id="`scroll-${category.id}`" rel="js-section-scroll">
          <Heading tag="div" size="md" weight="semibold" class="black mb-xs">
            {{ category.categoryName }}
          </Heading>
          <!-- <img v-if="category.image" :src="category.image" alt="category-image" class="rd-md mb-sm w-full"> -->
          <template v-if="category.products && category.products.length > 0">
            <div v-for="product in category.products" :key="product.id" class="mb-sm">
              <ProductItemTemplate1 :product="product" :listView="true" background="bg-white"/>
            </div>
          </template>
        </div>
      </template>
      <template v-else>
        <NoData />
      </template>
    </div>
  </div>
</div>
</template>
