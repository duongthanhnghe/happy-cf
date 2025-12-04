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
  <Popup v-model="storeCategoryMain.isTogglePopupFilter" popupHeading="Bộ lọc" bodyClass="bg-gray6" footerFixed align="right">
    <template #header >
      <Button v-if="storeCategoryMain.hasFilter" icon="filter_alt_off" color="secondary" @click.prevent="storeCategoryMain.resetFilter()" />
    </template>
    <template #body>
      <template v-if="storeCategoryMain.getListCategoryChildren.length > 0" class="mb-md">
        <Text text="Danh mục" color="black" size="normal" weight="semibold" class="mt-sm mb-sm" />
        <ProductFilterCategory :categoryName="props.categoryName" :list="storeCategoryMain.getListCategoryChildren"/>
      </template>

      <div v-if="props.variantGroups.length > 0" >
        <ProductFilterVariantGroup :variantGroups="props.variantGroups"/>
      </div>

      <Text text="Khoảng giá" color="black" size="normal" weight="semibold" class="mt-md mb-md" />
      <ProductFilterPrice />
    </template>
    <template #footer>
    <div class="text-center flex gap-xs justify-center">
      <Button color="black" :class="{'flex-1': storeCategoryMain.hasFilter }" label="Tiếp tục xem" @click.prevent="storeCategoryMain.handleTogglePopupFilter(false)"/>
      <Button v-if="storeCategoryMain.hasFilter" color="secondary" class="flex-1" label="Xoá bộ lọc" @click.prevent="storeCategoryMain.resetFilter()"/>
    </div>
  </template>
  </Popup>
</template>