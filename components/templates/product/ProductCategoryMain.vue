<script lang="ts" setup>
import type { ProductDTO } from '@/server/types/dto/v1/product.dto';
import { COLUMN } from '@/shared/constants/column';

const props = defineProps<{
  loadingData: boolean;
  listData: ProductDTO[] | null,
  description?: string;
  totalPages: number[];
  page: number | string;
  valueChangePage: boolean | null;
}>();

const emit = defineEmits<{
  (e: 'update:page', value: number | string): void;
  (e: 'update:valueChangePage', value: boolean): void;
}>();
</script>
<template>
  <div>
    <LoadingData v-if="props.loadingData && props.listData === null" />
    <div v-else-if="props.listData && props.listData.length > 0" :class="COLUMN.ROW">
      <div v-for="item in props.listData" :key="item.id" :class="COLUMN.PRODUCT">
        <ProductItemTemplate1 :product="item" background="bg-white" />
      </div>
    </div>
    <div v-else>
      <NoData />
    </div>

    <template v-if="props.totalPages && props.totalPages.length > 1">
      <div class="flex gap-sm justify-end">
        <Pagination 
          :totalPages="props.totalPages"
          :page="props.page"
          :valueChangePage="props.valueChangePage"
          @update:page="emit('update:page', $event)"
          @update:valueChangePage="emit('update:valueChangePage', $event)"
         />
      </div>
    </template>
  </div>
</template>