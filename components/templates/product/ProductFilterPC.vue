<script lang="ts" setup>
import { useCategoryMainStore } from '@/stores/client/product/useCategoryMainStore'
const storeCategoryMain = useCategoryMainStore()
const props = defineProps<{
  categoryName: string;
}>();
</script>
<template>
  <div class="sticky sticky-cover-header min-width-300 pt-section">
    <Button v-if="storeCategoryMain.hasFilter" color="black" class="w-full mb-md" label="Xoa bo loc" icon="filter_alt_off" @click.prevent="storeCategoryMain.resetFilter()"/>
    
    <Text text="Phan loai" color="black" size="normal" weight="semibold" class="mb-sm" />
    <ProductFilterDefault />

    <template v-if="storeCategoryMain.getListCategoryChildren.length > 0">
      <Text text="Danh muc" color="black" size="normal" weight="semibold" class="mt-md mb-sm" />
      <ProductFilterCategory :categoryName="props.categoryName" :list="storeCategoryMain.getListCategoryChildren"/>
    </template>    

    <Text text="Khoang gia" color="black" size="normal" weight="semibold" class="mt-md mb-md" />
    <ProductFilterPrice />
  </div>
</template>