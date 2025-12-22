<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes'
import { COLUMN } from "@/shared/constants/column"
import { useSearchStore } from "@/stores/client/product/useSearchStore"

definePageMeta({
  middleware: ROUTES.PUBLIC.PRODUCT.children?.SEARCH.middleware || '',
})
const store = useSearchStore()

</script>

<template>
  <div class="container container-xxl ">
    <BreadcrumbDefault />
    <div class="pt-lg pb-lg">
      <div class="flex flex-wrap gap-sm justify-between mb-ms">
        <Text :text="`Kết quả tìm kiếm: ${store.getListProductResult?.pagination?.total} sản phẩm`" size="md" color="black" weight="semibold" />
        <v-text-field
          v-model="store.txtSearch"
          label="Tim kiem..."
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          class="w-full max-width-400"
          @keydown.enter="store.handleViewAll"
          hide-details
          required>
        </v-text-field>
      </div>
    
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
        <template #load-more="{ props }">
          <Button color="secondary" label="Xem thêm" @click="props.onClick" />
        </template>
      </v-infinite-scroll>
      <NoData v-else="store.getListProductResult && store.getListProductResult.data.length === 0" class="mt-sm" text="Không có kết quả phù hợp" />
    </div>
  </div>
</template>
