<script lang="ts" setup>
import '@/styles/organisms/product/popup-section-list.scss'
import { watch } from 'vue'
import { useOrderStore } from '@/stores/client/product/useOrderIndexStore'
import type { CategoryProductDTO } from '@/server/types/dto/v1/product.dto'
import { ROUTES } from '@/shared/constants/routes';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import { COLUMN } from '@/shared/constants/column';

const store = useOrderStore()
const storeDisplay = useDisplayStore()

const props = withDefaults(defineProps<{
  items?: CategoryProductDTO[]
  loading?: boolean
  bgTab?: string
  variantTemplateProduct?: string
}>(), {
  items: () => [],
  loading: false,
  bgTab: 'bg-white'
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
  }
)

watch(mappedData, (val) => {
  if (val) {
    store.resultData = val
  }
}, { immediate: true })

</script>

<template>
  <div class="container container-xxl">
    <div class="product-category-list">
    <LoadingData v-if="props.loading" />
    <template v-else>
      <div
        v-for="category in store.getListProducts"
        :key="category.id" :id="`product-category-scroll${category.id}`"
        :data-id="`scroll-${category.id}`"
        rel="js-section-scroll"
        class="product-list-section pt-section"
        >
        <template v-if="category.banner">
          <img :src="category.banner" :alt="category.categoryName" :class="[storeDisplay.isLaptop ? 'rd-xl':'rd-lg','w-full']" />
        </template>
        <div :class='`product-list-section-top ${props.bgTab}`'>
          <Heading :headingSlug="`${ROUTES.PUBLIC.PRODUCT.children?.CATEGORY.path}/${category.slug}`" :text="category.categoryName" class="flex-1" size="xl">
            <div v-if="category.children && category.children.length > 1" class="product-list-section-button scroll-hide flex gap-xs">
              <Button
                v-for="item in [{ id: category.id, categoryName: 'Tất cả' }, ...category.children]"
                :key="item.id"
                :label="item.categoryName"
                :class="['weight-medium ',{ 'active': store.filterCategory[category.id] === item.id }]"
                :color="store.filterCategory[category.id] === item.id ? 'black':'secondary'"
                :size="storeDisplay.isLaptop ? 'md':'sm'"
                @click="store.filterCategory[category.id] = item.id"
              />
              <NuxtLink :to="`${ROUTES.PUBLIC.PRODUCT.children?.CATEGORY.path}/${category.slug}`" class="position-sticky right-0" v-tooltip.right="'Xem tất cả'">
                <Button color="secondary" :size="storeDisplay.isLaptop ? 'md':'sm'" icon="keyboard_arrow_right" />
              </NuxtLink>
            </div>
          </Heading>
        </div>
        <template v-if="category.products.data && category.products.data.length > 0">
          <v-infinite-scroll
          height="auto"
          mode="manual"
          :class="storeDisplay.isLaptop ? COLUMN.ROW : ''"
          @load="(ctx) => store.load(category, ctx)"
        >
            <div 
            v-for="(item, index) in category.products.data" 
            :key="index" 
            class=""
            :class="[storeDisplay.isLaptop ? `${COLUMN.PRODUCT_XL}`:'',{ _hidden: store.filterCategory[category.id] !== category.id && item.categoryId !== store.filterCategory[category.id] }]"
          >
            <ProductItemTemplate1 
              :product="item" 
              :listView="storeDisplay.isLaptop ? false : true"
              :variant="props.variantTemplateProduct"
            />
          </div>
          <template #load-more="{ props }">
            <div :class="category.products.pagination.totalPages === 1 ? '_hidden':''">
              <Button color="secondary" label="Xem thêm" @click="props.onClick" />
            </div>
          </template>
        </v-infinite-scroll>
        </template>
      </div>
    </template>
    </div>
  </div>
</template>
