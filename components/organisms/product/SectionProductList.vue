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
  bgTab?: string
  variantTemplateProduct?: string
  limitSection?: number
  listView?: boolean
}>(), {
  items: () => [],
  bgTab: 'bg-white',
  listView: false
})

watch(
  () => props.items,
  async (items) => {
    if (!items.length) return

    store.resultData = null

    const mapped = await store.mapProductsByCategory(items)
    store.resultData = mapped
  },
  { immediate: true }
)
</script>

<template>
  <div class="container container-xxl">
    <div class="product-category-list">
      <SkeletonProductList
        v-if="store.getListProducts === null"
        :count="12"
        :row="COLUMN.ROW"
        :column="COLUMN.PRODUCT_XL"
        :variant="props.variantTemplateProduct"
        heading
      />
      <template v-else>
        <div
          v-for="category in props.limitSection ? store.getListProducts?.slice(0,limitSection) : store.getListProducts"
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
            :class="!props.listView ? COLUMN.ROW : ''"
            @load="(ctx) => store.load(category, ctx)"
          >
              <div 
              v-for="(item, index) in category.products.data" 
              :key="index" 
              class=""
              :class="[!props.listView ? `${COLUMN.PRODUCT_XL}`:'',{ _hidden: store.filterCategory[category.id] !== category.id && item.categoryId !== store.filterCategory[category.id] }]"
            >
              <ProductItemTemplate1 
                :product="item" 
                :listView="props.listView"
                :variant="props.variantTemplateProduct"
              />
            </div>

            <div v-if="store.loadingMore[category.id]" class="flex-1 w-full ">
              <SkeletonProductList
                :count="12"
                :row="COLUMN.ROW"
                :column="COLUMN.PRODUCT_XL"
                :variant="props.variantTemplateProduct"
                rowClass="ml-0 mr-0"
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
