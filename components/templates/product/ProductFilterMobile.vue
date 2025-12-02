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
  <div class="mt-sm flex gap-xs" >
    <div class="shadow-2 rd-lg flex-1">
      <ProductFilterDefault />
    </div>
    <Button color="secondary" class="shadow-2" icon="filter_alt" @click="storeCategoryMain.handleTogglePopupFilter(true)"/>
  </div>

  <PopupProductFilterMobile :categoryName="props.categoryName" :variantGroups="props.variantGroups" />
</template>