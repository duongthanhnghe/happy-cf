<script lang="ts" setup>
import type { VariantGroupDTO } from '@/server/types/dto/v1/product.dto';
import { useCategoryMainStore } from '@/stores/client/product/useCategoryMainStore'
const storeCategoryMain = useCategoryMainStore()
const props = defineProps<{
  categoryName: string;
  variantGroups: VariantGroupDTO[];
}>();
</script>
<template>
  <div class="sticky sticky-cover-header min-width-300 max-width-300 overflow-auto max-height-cover-header pt-section">
    <Button v-if="storeCategoryMain.hasFilter" color="black" class="w-full mb-md" label="Xoá bộ lọc" icon="filter_alt_off" @click.prevent="storeCategoryMain.resetFilter()"/>
    
    <Text text="Phân loại" color="black" size="normal" weight="semibold" class="mb-sm" />
    <ProductFilterDefault />

    <template v-if="storeCategoryMain.getListCategoryChildren.length > 0">
      <Text text="Danh mục" color="black" size="normal" weight="semibold" class="mt-md mb-sm" />
      <ProductFilterCategory :categoryName="props.categoryName" :list="storeCategoryMain.getListCategoryChildren"/>
    </template>

    <div v-if="storeCategoryMain.getListCategoryChildren.length > 0" class="mt-md">
      <ProductFilterVariantGroup :variantGroups="props.variantGroups"/>
    </div> 

    <Text text="Khoảng giá" color="black" size="normal" weight="semibold" class="mt-md mb-md" />
    <ProductFilterPrice class="v-range-slider-custom" />
  </div>
</template>