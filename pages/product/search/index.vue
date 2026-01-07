<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes'
import { COLUMN } from "@/shared/constants/column"
import { useSearchStore } from "@/stores/client/product/useSearchStore"
import { useRoute } from 'vue-router'
import { nullRules } from '@/utils/validation';
import { watch } from 'vue'

definePageMeta({
  middleware: ROUTES.PUBLIC.PRODUCT.children?.SEARCH.middleware || '',
  showBreadcrumb: ROUTES.PUBLIC.PRODUCT.children?.SEARCH.showBreadcrumb,
})

const route = useRoute()
const store = useSearchStore()

watch(
  () => route.query.search,
  async (newSearch) => {
    if (!newSearch) return

    const keyword = newSearch as string
    store.txtSearch = keyword

    await store.fetchListProductSearch(keyword, 1, store.limit)
    store.items = store.getListProductSearch
  },
  { immediate: true }
)

</script>

<template>
  <div class="container container-xxl ">
    <div class="pt-lg pb-lg">
      <Heading :text="`Kết quả tìm kiếm: ${store.getListProductResult?.pagination?.total} sản phẩm`" size="xl">
        <v-text-field
          v-model="store.txtSearch"
          label="Tìm kiếm..."
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          class="w-full max-width-400"
          @keydown.enter="store.handleViewAll"
          hide-details
          :rules="nullRules"
          required>
        </v-text-field>
      </Heading>
    
      <v-infinite-scroll
        v-if="store.getListProductResult && store.getListProductResult.data.length > 0"
        height="auto"
        mode="manual"
        class="overflow-hidden-x"
        @load="store.load"
      >
        <div :class="COLUMN.ROW">
          <template v-for="(item, index) in store.getListProductResult.data" :key="index" >
            <div :class="COLUMN.PRODUCT_XL" >
              <ProductItemTemplate1 :product="item" />
            </div>
          </template>
        </div>
        <div v-if="store.loadingProduct" class="flex-1 w-full ">
          <SkeletonProductList
            :count="12"
            :row="COLUMN.ROW"
            :column="COLUMN.PRODUCT_XL"
          />
        </div>
        <template #load-more="{ props }">
          <Button color="secondary" label="Xem thêm" @click="props.onClick" />
        </template>
      </v-infinite-scroll>
      <NoData v-else="store.getListProductResult && store.getListProductResult.data.length === 0" class="mt-sm" text="Không có kết quả phù hợp" />
    </div>
  </div>
</template>
